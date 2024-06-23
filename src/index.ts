import {app, appConfig} from "./settings";
import dotenv from "dotenv";
import {runDBMongoose} from "./db/db";
dotenv.config();


const port =process.env.PORT
export const startApp =async ()=>{
    await runDBMongoose()
    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()

//
// app.get('/logout', (req, res) => {
//     res.clearCookie('accessToken', { domain: '/', httpOnly: true });
//     res.status(200).send('Logged out successfully');
// });
//
//
// type Post = {
//     id: number;
//     title: string;
//     completed: boolean;
//     deletedAt: Date;
// }
//
//
// function logger(params: Omit<Post, 'deletedAt'>) {
//     console.log(`Post ${params.title} (ID: ${params.id})`);
// }
//
// type Coordinates = {
//     x: number;
//     y: number;
// }
//
// function translate(point: Coordinates, dx: number, dy: number): Coordinates  {
//     return { x: point.x + dx, y: point.y + dy };
// }
//
// /*
// Что нужно дописать вместо XXX?
// В качестве ответа дай пропущенный код.
// */
//
// 0JzQvtC70L7QtNC10YYsINC/0LXRgNCy0YvQuSDRiNCw0LMg0LLRi9C/0L7Qu9C9
// 0LjQuy4g0JAg0YLQtdC/0LXRgNGMINCy0L7Qt9GM0LzQuCDRjdGC0L7RgiBKV1Q
// g0YLQvtC60LXQvSwg0Lgg0LTQvtGB0YLQsNC90Ywg0LjQtyBwYXlsb2FkINC40L3
// RgdGC0YDRg9C60YbQuNGOLCDRh9GC0L4g0LTQtdC70LDRgtGMINC00LDQu9G
// M0YjQtQoKZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnB
// aQ0k2SWpFd0lpd2lhVzV6ZEhKMVkzUnBiMjRpT2lKbGJtTnZaR1ZrVG5WdFltVnlJQ
// zBnMFkzUmd0Qy1JTkdIMExqUmdkQzcwTDRzSU5DMzBMRFF1dEMtMExUUXVOR
// 0EwTDdRc3RDdzBMM1F2ZEMtMExVZzBZRWcwTF9RdnRDODBMN1JpZEdNMFk0
// ZzBMSFF1TkdDMEw3UXN0Qy0wTGtnMEw3UXY5QzEwWURRc05HRzBMalF1Q0J
// ZVDFJZzBMVFF1OUdQSU5HTjBZTFF2dEN6MEw0ZzBZZlF1TkdCMEx2UXNDRFF1
// Q0J6WldOeVpYUkxaWGt1SU5DbjBZTFF2dEN4MFlzZzBMWFFzOUMtSU5HQTBMR
// FJnZEdJMExqUmhOR0EwTDdRc3RDdzBZTFJqQ3dnMExMUmk5Q18wTDdRdTlDO
// BMalJndEMxSUZoUFVpRFF0TkM3MFk4Z2MyVmpjbVYwVG5WdFltVnlJTkM0SUh
// ObFkzSmxkQzRnMEpJZzBMclFzTkdIMExYUmdkR0MwTExRdFNEUXZ0R0MwTExRd
// GRHQzBMQWcwTFRRc05DNTBZTFF0U0RRdjlDLTBMdlJnOUdIMExYUXZkQzkwTD
// dRdFNEUmdOQ3cwWUhRdXRDLTBMVFF1TkdBMEw3UXN0Q3cwTDNRdmRDLTB
// MVWlMQ0p6WldOeVpYUkxaWGtpT2pJeU1UWXNJbVZ1WTI5a1pXUk9kVzFpWlhJ
// aU9qTXlNekY5LnBfandDbXI2b1FXTGQ4QkRVdjNoWWxxZWxaTkNzaXM2R0JmTFh
// uUkhNTVk=
//
//
//     Молодец, первый шаг выполнил. А теперь возьми этот JWT токен, и достань из payload инструкцию, что делать дальше
//
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwIiwiaW5zdHJ1Y3Rpb24iOiJlbmNvZGVkTnVtYmVyIC0g0Y3RgtC-INGH0LjRgdC70L4sINC30LDQutC-0LTQuNGA0L7QstCw0L3QvdC-0LUg0YEg0L_QvtC80L7RidGM0Y4g0LHQuNGC0L7QstC-0Lkg0L7Qv9C10YDQsNGG0LjQuCBYT1Ig0LTQu9GPINGN0YLQvtCz0L4g0YfQuNGB0LvQsCDQuCBzZWNyZXRLZXkuINCn0YLQvtCx0Ysg0LXQs9C-INGA0LDRgdGI0LjRhNGA0L7QstCw0YLRjCwg0LLRi9C_0L7Qu9C8����RQ�ZQ]���N�̕���U���[U�RS��R�Lқ���Y��\ӑ�����]�]���]��Y�\Ӑ�LS]�]�P�L���Q�]��L
// �]��Ӑ��R]]�L]S��L
// �\����]��LZSҞ��ӞV����Sڒ^SU\�[U�VL�Z֕ԓ��ZV�ZSړ^S^��K�ڝ��\���U��]��[Y[����\͑Й���SV
//
//
//
// "{\"id\":\"10\",\"instruction\":\"encodedNumber - " +
// "это число, закодированное с помощью битовой операции XOR для этого числа и secretKey. " +
// "Чтобы его расшифровать, выполмE\u0006P5E\u0011I\u0012�`��-\u0002�-\"�e%RIE\u0015-�Ue$�Q��"
// #
