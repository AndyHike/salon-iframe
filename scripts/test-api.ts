import { loadBeautySalonHome } from './cms/loaders/loadBeautySalonHome';

async function main() {
  const data = await loadBeautySalonHome('localhost:3000');
  console.log(JSON.stringify(data?.servicesItems?.[0], null, 2));
}

main().catch(console.error);
