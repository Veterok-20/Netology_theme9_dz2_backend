const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const { koaBody } = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true})); 

let posts = [];
let nextId = 1;

const router = new Router();

router.get('/posts', async (ctx, next) => {
    console.log('from server(get) posts=', posts)
    // ctx.response.body = posts;
    // let responsePosts = posts.map((obj)=>JSON.stringify(obj));
    let responsePosts = JSON.stringify(posts);
    console.log('from server(get) responsePosts=', responsePosts)
    ctx.response.body = responsePosts;
});

router.post('/posts', async(ctx, next) => {
    const {id, content} = ctx.request.body;

    // if (id !== 0) {
    //     posts = posts.map(o => o.id !== id ? o : {...o, content: content});
    //     ctx.response.status = 204;
    //     return;
    // }
console.log('hello');
    console.log('from server(post) ctx.request.body=', ctx.request.body)
    // console.log('from server(post) ...ctx.request.body=', ...ctx.request.body)
    // posts.push({...ctx.request.body, id: nextId++, created: Date.now()});
let newpost = JSON.parse(ctx.request.body);
newpost.id = nextId++;
newpost.created = Date.now();
posts.push(newpost);

    ctx.response.status = 204;
    console.log('from server(post) posts=', posts)
});
 
router.delete('/posts/:id', async(ctx, next) => {
    const postId = Number(ctx.params.id);
    const index = posts.findIndex(o => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => {
    console.log(`server started http://localhost:${port}`)
}); 