import request from "supertest";
import dotenv from 'dotenv';

import {app} from "../src/settings";
import {HTTP_STATUSES} from "../src/models/common";


dotenv.config()


describe('/user', () => {


    it('delete all',
        async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

})