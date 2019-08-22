var express = require('express');
var router = express.Router();
const mysql = require('mysql');

function XSS_Check(value) {
    value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
    value = value.replace(/\</g, "&lt;");
    value = value.replace(/\>/g, "&gt;");
    return value;
}

/* post member_insert listing. */
router.post('/', function (req, res, next) {

    if (req.body.email == "" || req.body.name == "" || req.body.pw == "") {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else if (req.body.email.length > 44 || req.body.name.length > 44 || req.body.pw.length > 44) {
        const msg = {
            msg: "이메일, 이름, 비밀번호는 45자 이내로 가입해주세요."
        };
        res.json(JSON.stringify(msg));
    } else {
        if (req.session.dupState == 1 && req.session.dupEmail == req.body.email) {
            let conn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'mysql',
                database: 'nodejs'
            });

            conn.connect((err) => {
                if (err) {
                    return console.error(err.message);
                }

                const sql = `insert into certchain_account(email, password, name) values(?, password(?), ?)`

                const email = XSS_Check(req.body.email);
                const name = XSS_Check(req.body.name);

                conn.query(sql, [email, req.body.pw, name], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                        res.json(JSON.stringify(result));
                    } else {
                        console.log(result, fields);
                        const msg = { msg: name + "님 가입 되었습니다." };
                        res.json(JSON.stringify(msg));
                    }
                    conn.end();
                })
            });
        } else {
            const msg = { msg: "중복확인을 다시 해주세요." };
            res.json(JSON.stringify(msg));
        }
    }
});

module.exports = router;