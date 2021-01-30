import {table, minifyRecords} from "./utils/Airtable";
import auth0 from "./utils/auth0";


export default auth0.requireAuthentication(async (req, res) => {
    const {description} = req.body;
    const {user} = await auth0.getSession(req);
    try{
        const createdRecords = await table.create([
            {fields: {description, user_id: user.sub} },
        ]);
        const createdRecord = {
            id: createdRecords[0].id,
            fields: createdRecords[0].fields,
        }
        res.statusCode = 200
        res.json(createdRecord);
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({msg: 'Something went wrong'});
    }
});