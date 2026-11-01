type EmailBinding = { send(message: { from: string; to: string; raw: Uint8Array }): Promise<unknown> };
function base64(value:string){const bytes=new TextEncoder().encode(value);let binary="";for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary);}
function encodedHeader(value:string){return `=?UTF-8?B?${base64(value)}?=`;}
export async function sendSupportEmail(input:{binding?:EmailBinding;to:string;subject:string;body:string}){
 if(!input.binding)throw new Error("El servicio de correo EMAIL no está disponible.");
 const from="noreply@linguafly.app";
 const raw=[`From: LinguaFly <${from}>`,`To: <${input.to}>`,`Subject: ${encodedHeader(input.subject)}`,"MIME-Version: 1.0","Content-Type: text/plain; charset=UTF-8","Content-Transfer-Encoding: base64","","",base64(input.body)].join("\r\n");
 await input.binding.send({from,to:input.to,raw:new TextEncoder().encode(raw)});
}
