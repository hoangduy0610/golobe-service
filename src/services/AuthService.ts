import { Auth_RegiserDto } from '@/dtos/Auth_RegisterDto';
import { User } from '@/entities/User.entity';
import { EnumRoles } from '@/enums/EnumRoles';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Constant } from 'src/commons/Constant';
import { MessageCode } from 'src/commons/MessageCode';
import { ApplicationException } from 'src/controllers/ExceptionController';
import { Auth_LoginDto } from 'src/dtos/Auth_LoginDto';
import { UserModal } from 'src/models/User';
import { StringUtils } from 'src/utils/StringUtils';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {
    }

    async register(dto: Auth_RegiserDto): Promise<UserModal> {
        const { email, password, name } = dto;
        const user = await this.userRepository.findOne({ where: { email: email }, withDeleted: false });
        if (user) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, MessageCode.USER_ALREADY_EXISTED);
        }

        try {
            const hash = bcrypt.hashSync(password, Constant.BCRYPT_ROUND);
            const res = await this.userRepository.create({
                email: email,
                password: hash,
                role: EnumRoles.ROLE_USER,
                name: name,
            })
            await this.userRepository.save(res);

            return new UserModal(res);
        } catch (error) {
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, MessageCode.USER_CREATE_ERROR);
        }
    }

    async login(userAuthDto: Auth_LoginDto): Promise<any> {
        const safeEmail = StringUtils.xssPrevent(userAuthDto.email);
        const safePassword = StringUtils.xssPrevent(userAuthDto.password);
        const user = await this.userRepository.findOne({ where: { email: safeEmail }, withDeleted: false });

        if (!user) {
            throw new ApplicationException(HttpStatus.NOT_FOUND, MessageCode.USER_NOT_REGISTER);
        }

        if (!bcrypt.compareSync(safePassword, user.password)) {
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, MessageCode.USER_PASSWORD_WRONG);
        }

        const userData = new UserModal(user);

        const JWT_Payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        }

        try {
            const JWT = this.jwtService.sign(JWT_Payload);
            return { token: JWT, info: userData };
        } catch (e) {
            throw new ApplicationException(HttpStatus.UNAUTHORIZED, MessageCode.USER_PASSWORD_WRONG)
        }
    }

    async validateUser(payload: any): Promise<User> {
        return await this.userRepository.findOne({ where: { id: payload.id }, withDeleted: false });
    }
}