import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const root=process.cwd();
const source=await readFile(join(root,'data','offers.ts'),'utf8');
const overrides=JSON.parse(await readFile(join(root,'data','offer-overrides.json'),'utf8'));
const slugs=[...source.matchAll(/createOffer\("([^"]+)"/g)].map(m=>m[1]);
const concrete=/(\d[\d\s.,]*\s?(?:€|%|jours?|mois|ans)|nouveaux? clients?|premi(?:ère|er) (?:commande|achat|réservation)|dép[oô]t|versement|transaction|paiement|carte|contrat|abonnement|invest(?:ir|issement)|identité|minimum|code\s*[:#]|montant|seuil|panier|logement|expérience|mission|points|crédit|coupon|paliers?)/i;
const generic=/(créer (?:un )?compte|utiliser mon lien|inscri(?:vez|re)-vous|action demandée|conditions de l'offre|éligibilité|respecter les conditions|consultez les conditions|récompense est)/i;
const report={generatedAt:new Date().toISOString(),catalogueCount:slugs.length,specificConditions:0,specificSteps:0,complete:0,incomplete:[],sample:[]};
for(const slug of slugs){const o=overrides[slug]??{};const conditions=(o.conditions??[]).filter(v=>!generic.test(v)&&concrete.test(v));const steps=(o.steps??[]).filter(v=>!generic.test(`${v.title} ${v.description}`)&&concrete.test(`${v.title} ${v.description}`));const c=conditions.length>0,s=steps.length>0;if(c)report.specificConditions++;if(s)report.specificSteps++;if(c&&s)report.complete++;else report.incomplete.push({slug,missing:[...(c?[]:['conditions']),(s?null:'steps')].filter(Boolean)});if(report.sample.length<10)report.sample.push({slug,partner:o.name??slug,bonus:o.partnerReward??null,conditions,steps,source:o.researchSource??null});}
await writeFile(join(root,'research','truly-specific-conditions-report.json'),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));
