import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LiquidBackground from "@/components/LiquidBackground";
import InteractiveGlass from "@/components/InteractiveGlass";
import { Sparkles, Layers, Shield, Gauge, ArrowRight, BookOpen, Check, Pencil, Trash2, Plus, Menu } from "lucide-react";
import RealTimeActivityPanel from "@/components/RealTimeActivityPanel";

const Index = () => {
  const location = useLocation();
  const canonical = `${window.location.origin}${location.pathname}`;

  // Tema: dark por padrão (classe já presente no html). Toggle simples sem persistência.
  const [dark, setDark] = React.useState(true);
  React.useEffect(() => {
    const html = document.documentElement;
    setDark(html.classList.contains("dark"));
  }, []);
  React.useEffect(() => {
    const html = document.documentElement;
    if (dark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [dark]);

  // Brilho suave que segue o mouse em botões
  const setButtonGlow = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const clearButtonGlow = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Helmet>
        <title>Liquid Glass Dark UI | Starter roxo elegante</title>
        <meta name="description" content="Tema dark liquid glass com roxo harmônico, painéis vítreos e CTAs elegantes. Base moderna em React/Vite." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <header className="sticky top-0 z-20">
        <div className="container py-4">
          <div className="glass-panel flex items-center justify-between rounded-xl px-4 py-3">
            <Link to="/" className="font-semibold tracking-tight">
              Liquid Glass Starter
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 mr-2 text-xs text-muted-foreground">
                <span>Tema</span>
                <Switch checked={dark} onCheckedChange={setDark} aria-label="Alternar tema" className="toon-switch" />
              </div>
              <Button asChild variant="glass" size="sm">
                <a href="https://docs.lovable.dev/user-guides/quickstart" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                  <BookOpen className="opacity-80" /> Documentação
                </a>
              </Button>
              <Button asChild variant="hero" size="sm">
                <a href="#comecar" className="inline-flex items-center gap-2">
                  Começar <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="container relative min-h-[85svh] flex flex-col justify-center py-16">
          <div className="absolute inset-0 -z-10">
            <LiquidBackground />
          </div>

          <article id="comecar" className="mx-auto max-w-4xl text-center">
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-8 md:p-12 rounded-xl">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} /> SkillLearning
              </span>
              <h1 className="mt-4 mx-auto max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.2] md:leading-[1.2] pb-1 md:pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
                Aprender. Praticar. Evoluir.
              </h1>
              <p className="mt-3 md:mt-4 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground mb-8">
                Painéis vítreos, tipografia equilibrada e ações claras. Um ponto de partida moderno com foco em estética e performance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="hero" size="lg" asChild className="toon">
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2"
                    onMouseMove={setButtonGlow}
                    onMouseLeave={clearButtonGlow}
                  >
                    Explorar recursos <ArrowRight />
                  </a>
                </Button>
                <Button variant="glass" size="lg" asChild className="toon">
                  <a
                    href="https://docs.lovable.dev/user-guides/quickstart"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2"
                    onMouseMove={setButtonGlow}
                    onMouseLeave={clearButtonGlow}
                  >
                    <BookOpen /> Ver guia rápido
                  </a>
                </Button>
              </div>
            </InteractiveGlass>
          </article>

          <div id="features" className="mt-16 grid gap-6 md:grid-cols-3">
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/40 toon-icon">
                <Layers strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-semibold mb-1">Design System</h2>
              <p className="text-sm text-muted-foreground">Tokens HSL, variantes de botões e utilitários prontos para reutilização.</p>
            </InteractiveGlass>
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/40 toon-icon">
                <Shield strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-semibold mb-1">Acessível e Responsivo</h2>
              <p className="text-sm text-muted-foreground">Foco visível, contraste alto e layouts fluidos para qualquer tela.</p>
            </InteractiveGlass>
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-background/40 toon-icon">
                <Gauge strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-semibold mb-1">Performático e SEO</h2>
              <p className="text-sm text-muted-foreground">Title, descrição e canonical configurados; animações sutis e rápidas.</p>
            </InteractiveGlass>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl text-left">
              <h2 className="text-lg font-semibold mb-4">Formulário</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Seu nome" />
                </div>
                <div className="grid gap-2">
                  <Label>Tema</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="escuro">Escuro</SelectItem>
                      <SelectItem value="claro">Claro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif">Notificações</Label>
                  <Switch id="notif" className="toon-switch" />
                </div>
                <div className="grid gap-2">
                  <Label>Intensidade</Label>
                  <Slider defaultValue={[60]} />
                </div>
                <div>
                  <Button
                    variant="hero"
                    onMouseMove={setButtonGlow}
                    onMouseLeave={clearButtonGlow}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </InteractiveGlass>

            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Conteúdo em Abas</h2>
              <Tabs defaultValue="visao">
                <TabsList className="mb-3">
                  <TabsTrigger value="visao">Visão</TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                </TabsList>
                <TabsContent value="visao" className="text-sm text-muted-foreground">
                  Texto curto descrevendo a visão geral deste layout.
                </TabsContent>
                <TabsContent value="detalhes" className="text-sm text-muted-foreground">
                  Informações adicionais, variáveis do tema e tokens HSL.
                </TabsContent>
              </Tabs>
            </InteractiveGlass>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Tabela</h2>
              <Table className="toon-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Cartão</TableCell>
                    <TableCell>Ok</TableCell>
                    <TableCell className="text-right">
                      <Button variant="glass" size="sm" className="toon">Ver</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Formulário</TableCell>
                    <TableCell>Ok</TableCell>
                    <TableCell className="text-right">
                      <Button variant="glass" size="sm" className="toon">Ver</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </InteractiveGlass>

            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1">
                  <AccordionTrigger>O que é Liquid Glass?</AccordionTrigger>
                  <AccordionContent>
                    Estilo com painéis translúcidos, highlights e sombras suaves.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="a2">
                  <AccordionTrigger>Dark é padrão?</AccordionTrigger>
                  <AccordionContent>
                    Sim, o tema dark está ativo por padrão, com tokens HSL.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </InteractiveGlass>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="glass" className="toon inline-flex items-center gap-2">
                      <Menu /> Abrir menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-50 toon-glass">
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sair</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="hero" className="toon">Ação</Button>
              </div>
            </InteractiveGlass>

            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">CRUD Demo</h2>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Button size="sm" variant="hero" className="toon inline-flex items-center gap-1"><Plus size={16}/> Novo</Button>
                <Button size="sm" variant="glass" className="toon inline-flex items-center gap-1"><Pencil size={16}/> Editar</Button>
                <Button size="sm" variant="glass" className="toon inline-flex items-center gap-1"><Trash2 size={16}/> Excluir</Button>
              </div>
              <Table className="toon-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Item A</TableCell>
                    <TableCell className="text-right">
                      <Button variant="glass" size="sm" className="toon">Abrir</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>Item B</TableCell>
                    <TableCell className="text-right">
                      <Button variant="glass" size="sm" className="toon">Abrir</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </InteractiveGlass>

            <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Form Extra</h2>
              <div className="grid gap-3 text-left">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="msg">Mensagem</Label>
                  <Textarea id="msg" placeholder="Escreva sua mensagem..." />
                </div>
                <div className="pt-1">
                  <Button variant="glass" className="toon" onMouseMove={setButtonGlow} onMouseLeave={clearButtonGlow}>Enviar</Button>
                </div>
              </div>
            </InteractiveGlass>
          </div>
          
          {/* Planos (Regra do 3) */}
          <div id="precos" className="mt-16">
            <h2 className="sr-only">Planos</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl text-left">
                <div className="mb-2 text-sm text-muted-foreground">Starter</div>
                <div className="text-3xl font-bold mb-4">R$0<span className="text-base font-medium text-muted-foreground">/mês</span></div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check size={16}/> 3 componentes base</li>
                  <li className="flex items-center gap-2"><Check size={16}/> Tema dark/white</li>
                  <li className="flex items-center gap-2"><Check size={16}/> SEO básico</li>
                </ul>
                <Button variant="glass" className="toon w-full">Começar</Button>
              </InteractiveGlass>

              <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl text-left">
                <div className="mb-2 text-sm text-muted-foreground">Pro</div>
                <div className="text-3xl font-bold mb-4">R$29<span className="text-base font-medium text-muted-foreground">/mês</span></div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check size={16}/> 3 seções premium</li>
                  <li className="flex items-center gap-2"><Check size={16}/> Interações suaves</li>
                  <li className="flex items-center gap-2"><Check size={16}/> Suporte prioritário</li>
                </ul>
                <Button variant="hero" className="toon w-full">Assinar</Button>
              </InteractiveGlass>

              <InteractiveGlass className="glass-panel toon-glass hover-bounce p-6 rounded-xl text-left">
                <div className="mb-2 text-sm text-muted-foreground">Enterprise</div>
                <div className="text-3xl font-bold mb-4">Custom</div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check size={16}/> 3 integrações</li>
                  <li className="flex items-center gap-2"><Check size={16}/> Consultoria UI</li>
                  <li className="flex items-center gap-2"><Check size={16}/> SLAs dedicados</li>
                </ul>
                <Button variant="glass" className="toon w-full">Fale conosco</Button>
              </InteractiveGlass>
            </div>
          </div>
        </section>

        {/* Real-time activity section */}
        <section className="container py-16">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <InteractiveGlass className="glass-panel toon-glass p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Demonstração SignalR</h2>
                <p className="text-muted-foreground mb-6">
                  Este painel mostra atividades em tempo real usando SignalR.
                  Quando novos usuários se registram ou fazem login no sistema,
                  você verá as notificações aparecerem instantaneamente.
                </p>
                <div className="flex gap-4">
                  <Button variant="hero" size="sm">
                    Registrar Usuário de Teste
                  </Button>
                  <Button variant="glass" size="sm">
                    Simular Login
                  </Button>
                </div>
              </InteractiveGlass>
            </div>

            <div className="lg:col-span-1">
              <RealTimeActivityPanel />
            </div>
          </div>
        </section>
      </main>
      <footer className="container pb-10 text-center text-sm text-muted-foreground">
        Feito com React + Vite + Tailwind.
      </footer>
    </div>
  );
};

export default Index;
