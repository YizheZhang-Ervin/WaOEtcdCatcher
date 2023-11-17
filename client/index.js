import extra from "./extra.js"

const { createApp } = Vue

const axiosInstance = axios.create()

const app = createApp({
    data() {
        return {
            reqBody: undefined,
            example: [
                {
                    "method": "GET",
                    "url": "/version",
                    "params": "",
                    "data": ""
                }, {
                    "method": "GET",
                    "url": "/health",
                    "params": "",
                    "data": ""
                },
                {
                    "method": "POST",
                    "url": "/v3/cluster/member/list",
                    "params": "",
                    "data": ""
                },
                {
                    "method": "POST",
                    "url": "/v3/kv/put",
                    "params": "",
                    "data": { "key": "xx", "value": "yy" }

                },
                {
                    "method": "POST",
                    "url": "/v3/kv/range",
                    "params": "",
                    "data": { "key": "xx" }
                },
                {
                    "method": "POST",
                    "url": "/v3/kv/range",
                    "params": "",
                    "data": { "key": "xx", "range_end": "zz" }
                },
                {
                    "method": "POST",
                    "url": "/v3/watch",
                    "params": "",
                    "data": { "create_request": { "key": "xx" } }
                },
                {
                    "method": "POST",
                    "url": "/v3/kv/txn",
                    "params": "",
                    "data": { "compare": [{ "target": "CREATE", "key": "aa", "createRevision": "2" }], "success": [{ "requestPut": { "key": "aa", "value": "bb" } }] }
                },
                {
                    "method": "POST",
                    "url": "/v3/kv/txn",
                    "params": "",
                    "data": { "compare": [{ "version": "4", "result": "EQUAL", "target": "VERSION", "key": "aa" }], "success": [{ "requestRange": { "key": "aa" } }] }
                },
                {
                    "method": "POST",
                    "url": "/v3/auth/user/add",
                    "params": "",
                    "data": { "name": "root", "password": "pass" }
                },
                {
                    "method": "POST",
                    "url": "/v3/auth/role/add",
                    "params": "",
                    "data": { "name": "root" }
                },
                {
                    "method": "POST",
                    "url": "/v3/auth/user/grant",
                    "params": "",
                    "data": { "user": "root", "role": "root" }
                },
                {
                    "method": "POST",
                    "url": "/v3/auth/enable",
                    "params": "",
                    "data": {}
                },
                {
                    "method": "POST",
                    "url": "/v3/auth/authenticate",
                    "params": "",
                    "data": { "name": "root", "password": "pass" }
                }
            ],
            result: undefined,
            plainTxt: undefined,
            encryptedTxt: undefined
        }
    },
    mounted() {
    },
    methods: {
        callEtcd() {
            const req = JSON.parse(this.reqBody)
            axiosInstance.post("/callEtcd", req)
                .then((response) => {
                    this.result = response.data
                }).catch((err) => {
                    this.result = err
                }).finally(() => {
                })
        },
        transformText() {
            this.encryptedTxt = btoa(this.plainTxt)
        }
    }
})
app.component("extra", extra)
app.mount('#app')