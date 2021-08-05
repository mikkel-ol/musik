import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Container } from 'typedi';
import { Client } from './Client';
import { Player } from './Player';

import { Express } from './Express';
import Passport from './Passport';

dotenv.config();

// Initialize everything using the IoC.
Container.get<Client>(Client);
Container.get<Player>(Player);
Container.get<Passport>(Passport);

const app = Container.get<Express>(Express);

// ! We have to do this to make sure everything else is setup
// ! before attaching routes and starting web server
app.run();
