import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Statement = { bind(...values: (string|number)[]): Statement; first<T>(): Promise<T|null>; run(): Promise<unknown>; };
type DB = { prepare(sql:string):Statement };
const COOKIE = "lf_student_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
async function db():Promise<DB>{const {env}=await getCloudflareContext();return (env as unknown as {COURSE_DB:DB}).COURSE_DB;}
function hex(bytes:Uint8Array){return Array.from(bytes).map(v=>v.toString(16).padStart(2,"0")).join("");}
async function digest(value:string){return hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))));}
export async function hashPassword(password:string,saltHex:string){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:Uint8Array.from(saltHex.match(/.{2}/g)!.map(v=>parseInt(v,16))),iterations:120000,hash:"SHA-256"},key,256);
 return hex(new Uint8Array(bits));
}
export async function createSession(learnerId:string){
 const token=hex(crypto.getRandomValues(new Uint8Array(32))), tokenHash=await digest(token);
 const database=await db();
 await database.prepare("INSERT INTO learner_sessions(token_hash,learner_id,expires_at) VALUES(?,?,datetime('now', '+30 days'))").bind(tokenHash,learnerId).run();
 const jar=await cookies();jar.set(COOKIE,token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:SESSION_SECONDS});
}
export async function getStudent(){
 const jar=await cookies(),token=jar.get(COOKIE)?.value;if(!token)return null;
 const database=await db(),tokenHash=await digest(token);
 const row=await database.prepare("SELECT a.learner_id,a.email,a.display_name FROM learner_sessions s JOIN learner_accounts a ON a.learner_id=s.learner_id JOIN learners l ON l.id=a.learner_id WHERE s.token_hash=? AND s.expires_at>datetime('now') AND l.status='active'").bind(tokenHash).first<{learner_id:string;email:string;display_name:string}>();
 return row;
}
export async function endSession(){
 const jar=await cookies(),token=jar.get(COOKIE)?.value;
 if(token){const database=await db();await database.prepare("DELETE FROM learner_sessions WHERE token_hash=?").bind(await digest(token)).run();}
 jar.delete(COOKIE);
}
export async function hasCourseAccess(learnerId:string,courseKey:string){
 const database=await db();
 const row=await database.prepare("SELECT 1 AS allowed FROM course_enrolments WHERE learner_id=? AND course_key=? AND status='active' LIMIT 1").bind(learnerId,courseKey).first<{allowed:number}>();
 return !!row;
}
