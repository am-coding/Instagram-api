"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var instagram_mqtt_1 = require("instagram_mqtt");
var instagram_private_api_1 = require("instagram-private-api");
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var http = require('http');
var ig = instagram_mqtt_1.withRealtime(new instagram_private_api_1.IgApiClient());
var PORT = process.env.PORT || 5000;
// initialize configuration
dotenv_1.default.config();
// port is now available to the Node.js runtime 
// as if it were an environment variable
var port = process.env.SERVER_PORT || 5000;
var app = express_1.default();
app.use(cors_1.default());
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.ACCOUNT_TOKEN;
var client = require('twilio')(accountSid, authToken);
var MessagingResponse = require('twilio').twiml.MessagingResponse;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname + '/public'));
// define a route handler for the default home page
app.post('/login', function (req, res) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // this extends the IgApiClient with realtime features
                    // normal login
                    ig.state.generateDevice(req.body.username);
                    return [4 /*yield*/, ig.account.login(req.body.username, req.body.password)];
                case 1:
                    _d.sent();
                    console.log(req.body.username, req.body.password);
                    // now `ig` is a client with a valid sessio
                    // whenever something gets sent and has no event, this is called
                    // this is called with a wrapper use {message} to only get the message from the wrapper
                    ig.realtime.on('message', logEvent('messageWrapper'));
                    // whenever something gets sent to /ig_realtime_sub and has no event, this is called
                    // whenever the client has a fatal error
                    ig.realtime.on('error', console.error);
                    ig.realtime.on('close', function () { return console.error('RealtimeClient closed'); });
                    _b = (_a = ig.realtime).connect;
                    _c = {};
                    return [4 /*yield*/, ig.feed.directInbox().request()];
                case 2: 
                // connect    
                // this will resolve once all initial subscriptions have been sent
                return [4 /*yield*/, _b.apply(_a, [(_c.irisData = _d.sent(),
                            _c)])];
                case 3:
                    // connect    
                    // this will resolve once all initial subscriptions have been sent
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
    res.writeHead(302, {
        'Location': '/login',
    });
    res.end();
    var clientMsg;
    var loop;
    app.post('/', function (req, res) {
        clientMsg = req.body.Body;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var thread, i, element_1, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ig.feed.directInbox().records()];
                    case 1:
                        thread = (_a.sent())[0];
                        if (!clientMsg.includes('!50')) return [3 /*break*/, 6];
                        loop = clientMsg.split("!50").join('');
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < 50)) return [3 /*break*/, 5];
                        element_1 = thread.broadcastText(loop);
                        return [4 /*yield*/, element_1];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        res.writeHead(200, { 'Content-Type': 'text/xml' });
                        res.end();
                        _a.label = 6;
                    case 6:
                        element = thread.broadcastText(clientMsg);
                        return [4 /*yield*/, element];
                    case 7:
                        _a.sent();
                        res.writeHead(200, { 'Content-Type': 'text/xml' });
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); })();
    });
    /**
     * A wrapper function to log to the console
     * @param name
     * @returns {(data) => void}
     */
    function logEvent(name) {
        return function (data) {
            var txt = data.message.text;
            client.messages
                .create({
                from: 'whatsapp:+14155238886',
                body: clientMsg === txt || loop === txt ? null : txt,
                to: "whatsapp:+91" + req.body.number
            })
                .then(function (message) { return console.log(message); });
        };
    }
});
app.get('/login', function (req, res) {
    res.render('chat');
});
app.get('/', function (req, res) { return res.render('index'); });
app.listen(PORT, function () { return console.log("Example app listening at http://localhost:" + PORT); });
