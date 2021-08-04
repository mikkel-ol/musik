import { Controller, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

@Controller('/auth')
export class AuthController {
    @Get()
    getAll() {
        return 'Works';
    }
}
