import Koa, { Request, Response, Context } from 'koa';
import router from 'koa-route';

export class App {
  constructor() {
    this.app = new Koa();
  }

  deploy({ port }: { port: number }) {

    // respond with "hello world" when a GET request is made to the homepage
    this.app.use(router.get('/', (ctx: Context) => {
      ctx.body = 'hello world';
    }));

    // Serve the application at the given port
    this.app.listen(port, () => {
      // Success callback
      process.stdout.write(`Listening at http://localhost:${port}\n`);
    });
  }

  private app: Koa;
}