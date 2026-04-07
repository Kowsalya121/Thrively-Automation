import{test, expect} from "@playwright/test"

test.describe("Authentication api validation", ()=>{

test('check auth', async({request})=>{

const response = request.post('https://qa.thrively.com/user/authenticate',
{
    data:{
    mode : "email",
    mode_id: "qa+kowsalya+parent@liftoffllc.com",
    password : "123456"
}});
expect((await response).status).toBe(200);
console.log(response);
})
});