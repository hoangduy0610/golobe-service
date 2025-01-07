import { ApplicationException } from '@/controllers/ExceptionController';
import { Location } from '@/entities/Location.entity';
import { Service } from '@/entities/Service.entity';
import { ServiceType } from '@/entities/ServiceType.entity';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AzureChatOpenAI } from '@langchain/openai';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
        @InjectRepository(ServiceType) private readonly serviceTypeRepository: Repository<ServiceType>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>
    ) { }

    async processUserMessage(userMessage: string): Promise<string> {
        try {
            // Retrive data from DB
            const locationData = await this.locationRepository.find();
            const serviceData = await this.serviceRepository.find({
                relations: ['serviceType']
            });

            // Split system prompt and user prompt
            let systemPrompt = `You're an AI assistant that helps users planning their trip. You can provide information about locations, services, and service types. You can also help users to find the best service for their needs. Do not makeup any data.`;
            let userPrompt = `These are the data that you can use.
<LOCATION>
<SERVICE>
I need you to help me with the following user message: {input}. Please remember to answer in Vietnamese`;

            // Fill in the blanks
            const locationDataString = locationData.map(location => `- Location Name: ${location.name}, address: ${location.address}`).join(', ');
            const serviceString = serviceData.map(service => `- Service Name: ${service.name}, type of service: ${service.serviceType.name}, address: ${service.address}, phone: ${service.phone}, email: ${service.email}, website: ${service.website}, price range: ${service.priceRange}`).join(', ');
            userPrompt.replace('<LOCATION>', locationDataString);
            userPrompt.replace('<SERVICE>', serviceString);

            const prompt = ChatPromptTemplate.fromMessages([
                ['system', systemPrompt],
                ['human', userPrompt],
            ]);

            const model = new AzureChatOpenAI({
                temperature: 0.01,
                model: "gpt-4o",
                // azureOpenAIApiKey: "<your_key>", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
                // azureOpenAIApiInstanceName: "<your_instance_name>", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
                // azureOpenAIApiDeploymentName: "<your_deployment_name>", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
                // azureOpenAIApiVersion: "<api_version>", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
                maxRetries: 2,
            });

            const outputParser = new HttpResponseOutputParser();
            const chain = prompt.pipe(model).pipe(outputParser);
            const response = await chain.invoke({
                input: userMessage,
            });

            return Object.values(response)
                .map((code) => String.fromCharCode(code))
                .join('')
        } catch (e: any) {
            console.log(e);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, 'Error processing user message');
        }
    }
}
