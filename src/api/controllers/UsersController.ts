import { JsonController, NotFoundError, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Client } from '../../Client';
import { Player } from '../../music/Player';

@Service()
//@Authorized()
@JsonController('/users')
export class UsersController {
    constructor(private player: Player, private client: Client) { }
}
