import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Container } from 'typedi';
import { Client } from './Client';
import { Player } from './Player';

dotenv.config();

// Initialize the Client using the IoC.
Container.get<Client>(Client);

// Initialize music player same way
Container.get<Player>(Player);
