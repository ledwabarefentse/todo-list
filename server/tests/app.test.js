const request = require("supertest");
const fs = require("fs/promises");
const { createApp } = require("../src/app");
const { DATA_PATH } = require("../src/storage");

async function resetData() {
  await fs.writeFile(DATA_PATH, JSON.stringify([], null, 2), "utf8");
}

describe("Tiny Tasks API", () => {
  const app = createApp();

  beforeEach(async () => {
    await resetData();
  });

  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test("POST /tasks validates title", async () => {
    const res = await request(app).post("/tasks").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("title is required");
  });

  test("POST /tasks creates a task; GET /tasks returns it", async () => {
    const create = await request(app).post("/tasks").send({ title: "Buy milk" });
    expect(create.status).toBe(201);
    expect(create.body.title).toBe("Buy milk");
    expect(create.body.done).toBe(false);

    const list = await request(app).get("/tasks");
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);
    expect(list.body[0].title).toBe("Buy milk");
  });

  test("PATCH /tasks/:id/toggle flips done", async () => {
    const create = await request(app).post("/tasks").send({ title: "Task A" });
    const id = create.body.id;

    const toggle1 = await request(app).patch(`/tasks/${id}/toggle`);
    expect(toggle1.status).toBe(200);
    expect(toggle1.body.done).toBe(true);

    const toggle2 = await request(app).patch(`/tasks/${id}/toggle`);
    expect(toggle2.status).toBe(200);
    expect(toggle2.body.done).toBe(false);
  });

  test("DELETE /tasks/:id removes a task", async () => {
    const create = await request(app).post("/tasks").send({ title: "Task X" });
    const id = create.body.id;

    const del = await request(app).delete(`/tasks/${id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get("/tasks");
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(0);
  });
});
