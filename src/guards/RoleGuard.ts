import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationException } from '../controllers/ExceptionController';
import { MessageCode } from '../commons/MessageCode';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {
	}

	canActivate(context: ExecutionContext): boolean {
		const role = this.reflector.get<string>('role', context.getHandler());
		if (!role) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const hasRole = () => user.role === role;
		if (user && user.role && hasRole()) {
			return true;
		}
		throw new ApplicationException(HttpStatus.FORBIDDEN, MessageCode.USER_NOT_HAVE_PERMISSION);
	}
}