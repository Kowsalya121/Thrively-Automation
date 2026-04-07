import { test, expect } from "@playwright/test";

test.describe("Summary api validation", () => {

  test('status code = 200', async ({ request }) => {

    // ✅ Step 1: Login to get cookie
    const loginres = await request.post(
      'https://qa.thrively.com/user/authenticate',
      {
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
        }
      }
    );
    const body = await loginres.json();
    const token = body.jwt_token;


    // ✅ Step 2: Use cookie in summary API
    const response = await request.get(
      'https://qa.thrively.com/user/summary',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    expect(response.status()).toBe(200);

    console.log(await response.json());
  });

});





