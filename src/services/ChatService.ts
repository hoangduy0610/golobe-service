import { ApplicationException } from '@/controllers/ExceptionController';
import { Location } from '@/entities/Location.entity';
import { Service } from '@/entities/Service.entity';
import { ServiceType } from '@/entities/ServiceType.entity';
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AzureChatOpenAI, AzureOpenAIEmbeddings } from '@langchain/openai';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
        @InjectRepository(ServiceType) private readonly serviceTypeRepository: Repository<ServiceType>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>
    ) { }

    async processUserMessage(userMessage: string): Promise<any> {
        try {
            const model = new AzureChatOpenAI({
                temperature: 0.01,
                model: "gpt-4o",
                maxRetries: 2,
            });
            const embeddings = new AzureOpenAIEmbeddings({ maxRetries: 1 });

            // Retrive data from DB
            const locationData = await this.locationRepository.find();
            const serviceData = await this.serviceRepository.find({
                relations: ['serviceType']
            });
            const locationDataString = locationData.map(location => `- Địa điểm: ${location.name}, địa chỉ: ${location.address}`).join('\n');
            const serviceString = serviceData.map(service => `- Dịch vụ: ${service.name}, loại dịch vụ: ${service.serviceType.name}, địa chỉ: ${service.address}, số điện thoại: ${service.phone}, email: ${service.email}, website: ${service.website}, mức giá: ${service.priceRange}`).join('\n');
            
            // Split system prompt and user prompt
            let systemPrompt = `Bạn là trợ lý AI giúp người dùng lập kế hoạch cho chuyến đi của họ. Bạn có thể cung cấp thông tin về địa điểm, dịch vụ và loại dịch vụ. Bạn cũng có thể giúp người dùng tìm dịch vụ tốt nhất cho nhu cầu của họ. Không được tạo ra bất kỳ dữ liệu nào.`;
            let userPrompt = `Hãy giúp tôi trả lời câu hỏi sau: {input}\nsử dụng các dữ liệu sau:\n\n{context}`;

            const store = await FaissStore.fromTexts(
                [locationDataString, serviceString],
                ["location", "service"],
                embeddings
            );

            const tempPrompt = ChatPromptTemplate.fromMessages([
                ["system", systemPrompt],
                ["human", userPrompt],
            ])
            
            const combineDocsChain = await createStuffDocumentsChain({
                llm: model,
                prompt: tempPrompt,
            });

            const chain = await createRetrievalChain({
                retriever: store.asRetriever(),
                combineDocsChain,
            });

            const response = await chain.invoke({ input: userMessage });
            return response.answer;
        } catch (e: any) {
            console.log(e);
            throw new ApplicationException(HttpStatus.BAD_REQUEST, 'Error processing user message');
        }
    }
}
