import axios, { AxiosResponse } from "axios";

test("Get memes", async () => {
  const response: AxiosResponse<any> = await axios.get(
    "http://127.0.0.1:3000/api/memes"
  );

  expect(response.status).toBe(200);
  expect(response.headers["content-type"]).toBe(
    "application/json; charset=utf-8"
  );
});
