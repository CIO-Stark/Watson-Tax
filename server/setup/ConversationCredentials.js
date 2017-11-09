(function (process) {
    "use strict";

    module.exports = {
        "creds": {
            "username": process.env.conversation_user || JSON.parse(process.env.VCAP_SERVICES)["conversation"][0].credentials.username,
            "password": process.env.conversation_pass || JSON.parse(process.env.VCAP_SERVICES)["conversation"][0].credentials.password,
            "version": "v1",
            "version_date": "2017-02-03",
            "workspace_id": process.env.workspace_id
        }
    };

}(process));