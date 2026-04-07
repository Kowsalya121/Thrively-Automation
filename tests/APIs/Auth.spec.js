import{test, expect} from "@playwright/test"

test.describe("Authentication api validation", ()=>{

test('check auth', async({request})=>{

const response = await request.post('https://qa.thrively.com/user/authenticate',
{
    headers: {
        'Content-Type': 'application/json'
      },
    data: {
            options: {
              login_path: "https://qa.thrively.com/ng/#/classroom",
              remember_me: ""
            },
            user: {
              mode: "email",
              mode_id: "qa+kowsalya+thrive@liftoffllc.com",
              password: "pass@121"
            }
}});

expect(response.status()).toBe(200);
const body = await response.json();
console.log(body);
})
test("checking by entering the invalid password", async({request})=>{
const response = await request.post("https://qa.thrively.com/user/authenticate",{ data :{ options: {
    login_path: "https://qa.thrively.com/ng/#/classroom",
    remember_me: ""
  }, 
  user :{
    mode: "email",
    mode_id: "qa+kowsalya+thrive@liftoffllc.com",
    password: "123456"
  }
}});
expect(response.status()).toBe(400);
})
});