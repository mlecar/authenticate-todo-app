import {table, minifyRecords} from "./utils/Airtable";
import auth0 from "./utils/auth0";

export default auth0.requireAuthentication(async (req, res) => {
    const {user} = await auth0.getSession(req);
    try{
        const records = await table.select({
            filterByFormula: `user_id = '${user.sub}'`
        }).firstPage();
        const minifiedRecords = minifyRecords(records);
        res.statusCode = 200
        res.json(minifiedRecords);
    } catch (err) {
        res.statusCode = 500;
        res.json({msg: 'Something went wrong'});
    }
});