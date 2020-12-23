import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as autopopulate from 'mongoose-autopopulate';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      connectionFactory: connection => {
        connection.plugin(autopopulate);
        return connection;
      },
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
