# 🎨 Arquitetura Multi-Tenant para Sites de Casamento

## Visão Geral

Este documento descreve como transformar o site de casamento em uma plataforma "vendível" para múltiplos casais, usando padrões de design escaláveis e configurações personalizáveis.

---

## 🏗️ Design Patterns Utilizados

### 1. Configuration Pattern (Tenant-based)
Cada casal possui uma configuração isolada que define todos os aspectos do site.

### 2. Context API Pattern
Gerenciamento de estado global para acessar configurações do casal em qualquer componente.

### 3. Theme Provider Pattern
Injeção dinâmica de cores e estilos baseados na configuração do casal.

---

## 📁 Estrutura de Arquivos Proposta

```
src/
├── config/
│   ├── types/
│   │   └── coupleConfig.types.ts
│   ├── couples/
│   │   ├── vitoria-yuri.config.ts
│   │   ├── joao-maria.config.ts
│   │   └── index.ts
│   └── current.config.ts
├── contexts/
│   └── CoupleContext.tsx
├── hooks/
│   └── useTheme.ts
├── components/
│   └── ... (componentes existentes)
└── utils/
    └── theme.utils.ts
```

---

## 💾 1. Interface de Configuração

**Arquivo:** `src/config/types/coupleConfig.types.ts`

```typescript
export interface CoupleConfig {
  // ========================
  // INFORMAÇÕES DO CASAL
  // ========================
  couple: {
    bride: string;          // Nome da noiva
    groom: string;          // Nome do noivo
    weddingDate: string;    // Data do casamento (ISO format)
    slug: string;           // URL amigável (ex: vitoria-yuri)
  };

  // ========================
  // TEMA E CORES
  // ========================
  theme: {
    primary: string;        // Cor principal (#B24C60)
    secondary: string;      // Cor secundária (#CE6375)
    accent: string;         // Cor de destaque (#E8B4BC)
    background: string;     // Cor de fundo (#FFF5F7)
  };

  // ========================
  // CERIMÔNIA
  // ========================
  ceremony: {
    date: string;           // Data formatada (ex: "30 de Maio de 2026")
    time: string;           // Horário (ex: "16:00")
    venue: {
      name: string;         // Nome do local
      address: string;      // Endereço completo
      city: string;         // Cidade
      state: string;        // Estado
      zipCode: string;      // CEP
      mapUrl: string;       // URL do Google Maps
      latitude: number;     // Coordenada GPS
      longitude: number;    // Coordenada GPS
    };
  };

  // ========================
  // RECEPÇÃO (OPCIONAL)
  // ========================
  reception?: {
    time: string;
    venue: {
      name: string;
      address: string;
      city: string;
      state: string;
      mapUrl: string;
    };
  };

  // ========================
  // MENSAGENS PERSONALIZADAS
  // ========================
  messages: {
    welcome: string;        // Mensagem de boas-vindas
    ourStory: string;       // História do casal
    giftListMessage?: string; // Mensagem da lista de presentes
  };

  // ========================
  // ASSETS (IMAGENS)
  // ========================
  assets: {
    logo?: string;                  // Logo personalizado
    heroImageDesktop: string;       // Imagem principal desktop
    heroImageMobile: string;        // Imagem principal mobile
    photoGallery: string[];         // Galeria de fotos
    churchImage?: string;           // Imagem da igreja
  };

  // ========================
  // ADMINISTRADORES
  // ========================
  admins: string[];                 // Emails dos admins

  // ========================
  // FEATURES (TOGGLE)
  // ========================
  features: {
    showGiftList: boolean;          // Mostrar lista de presentes
    showPhotoGallery: boolean;      // Mostrar galeria de fotos
    showRSVP: boolean;              // Mostrar confirmação de presença
    showCountdown: boolean;         // Mostrar contador regressivo
    showOurStory: boolean;          // Mostrar nossa história
    showReception: boolean;         // Mostrar informações da recepção
  };

  // ========================
  // REDES SOCIAIS (OPCIONAL)
  // ========================
  social?: {
    instagram?: string;
    facebook?: string;
    hashtag?: string;               // Hashtag do casamento
  };
}
```

---

## 🎯 2. Exemplo de Configuração

**Arquivo:** `src/config/couples/vitoria-yuri.config.ts`

```typescript
import { CoupleConfig } from '../types/coupleConfig.types';

export const vitoriaYuriConfig: CoupleConfig = {
  // Informações do Casal
  couple: {
    bride: "Vitória",
    groom: "Yuri",
    weddingDate: "2026-05-30",
    slug: "vitoria-yuri"
  },
  
  // Tema e Cores
  theme: {
    primary: "#B24C60",
    secondary: "#CE6375",
    accent: "#E8B4BC",
    background: "#FFF5F7"
  },

  // Cerimônia
  ceremony: {
    date: "30 de Maio de 2026",
    time: "16:00",
    venue: {
      name: "Matriz Nossa Senhora de Oliveira",
      address: "Praça da Matriz, Centro",
      city: "Oliveira",
      state: "MG",
      zipCode: "35540-000",
      mapUrl: "https://maps.google.com/maps?q=Matriz+Nossa+Senhora+de+Oliveira+oliveira+mg+centro",
      latitude: -20.697,
      longitude: -44.827
    }
  },

  // Recepção (opcional)
  reception: {
    time: "18:00",
    venue: {
      name: "Espaço Villa Garden",
      address: "Rodovia BR-123, Km 45",
      city: "Oliveira",
      state: "MG",
      mapUrl: "https://maps.google.com/..."
    }
  },

  // Mensagens Personalizadas
  messages: {
    welcome: "O momento tão esperado está cada vez mais próximo e não poderíamos estar mais felizes em compartilhar essa jornada com vocês!",
    ourStory: "Cada passo da nossa história de amor nos trouxe até aqui, e o nosso grande dia, escolhido por Deus para unir nossas vidas, já enche nossos corações de alegria e expectativa. ✨",
    giftListMessage: "Sua presença é o nosso maior presente! Mas se desejar nos presentear, preparamos uma lista com carinho."
  },

  // Assets
  assets: {
    heroImageDesktop: "/assets/main_pic_background.jpeg",
    heroImageMobile: "/assets/photo_session_3.jpeg",
    churchImage: "/assets/nsradeoliveira_catedral.jpg",
    photoGallery: [
      "/assets/photo_session.jpeg",
      "/assets/photo_session_2.jpeg",
      "/assets/photo_session_3.jpeg",
      "/assets/main_wedding.jpeg"
    ]
  },

  // Admins
  admins: [
    "nathansaraujo191@gmail.com",
    "vitoriaeyuri26@gmail.com",
    "yurigabrielmagdalena@gmail.com"
  ],

  // Features
  features: {
    showGiftList: true,
    showPhotoGallery: true,
    showRSVP: true,
    showCountdown: true,
    showOurStory: true,
    showReception: true
  },

  // Redes Sociais
  social: {
    instagram: "@vitoriayuri",
    hashtag: "#CasamentoVitoriaYuri"
  }
};
```

---

## 🔄 3. Context Provider

**Arquivo:** `src/contexts/CoupleContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';
import { CoupleConfig } from '../config/types/coupleConfig.types';
import { currentCoupleConfig } from '../config/current.config';

interface CoupleContextType {
  config: CoupleConfig;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export function CoupleProvider({ children }: { children: ReactNode }) {
  return (
    <CoupleContext.Provider value={{ config: currentCoupleConfig }}>
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within CoupleProvider');
  }
  return context;
}
```

---

## 🎨 4. Hook para Tema Dinâmico

**Arquivo:** `src/hooks/useTheme.ts`

```typescript
import { useCouple } from '../contexts/CoupleContext';
import { useEffect } from 'react';

export function useTheme() {
  const { config } = useCouple();

  useEffect(() => {
    // Injeta CSS variables dinamicamente no :root
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.theme.primary);
    root.style.setProperty('--color-secondary', config.theme.secondary);
    root.style.setProperty('--color-accent', config.theme.accent);
    root.style.setProperty('--color-background', config.theme.background);
  }, [config.theme]);

  return config.theme;
}
```

---

## 🛠️ 5. Configuração do Tailwind

**Arquivo:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wedding: {
          50: 'var(--color-background, #FFF5F7)',
          100: '#F8E8EC',
          200: '#F1D1D9',
          300: '#E8B4BC',
          400: '#CE6375',
          500: 'var(--color-primary, #B24C60)',
          600: 'var(--color-secondary, #9A3F52)',
          700: '#7D3342',
          800: '#5F2733',
          900: '#3E1A21',
        },
      },
    },
  },
  plugins: [],
};
```

---

## 📱 6. Exemplo de Uso nos Componentes

### Home Component

```typescript
import { useCouple } from '../../contexts/CoupleContext';

function Home() {
  const { config } = useCouple();

  return (
    <>
      {/* Background dinâmico */}
      <section id="home-hero" className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{ backgroundImage: `url(${config.assets.heroImageMobile})` }}
        />
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.assets.heroImageDesktop})` }}
        />
        
        <div className="relative z-10">
          <h1 className="text-white">
            Bem-vindos ao nosso
            <span className="text-wedding-400">Casamento</span>
          </h1>
          
          {/* Mensagem personalizada */}
          <p>{config.messages.welcome}</p>
        </div>
      </section>
    </>
  );
}
```

### Navbar Component

```typescript
import { useCouple } from '../../contexts/CoupleContext';

function Navbar() {
  const { config } = useCouple();

  return (
    <nav className="bg-white shadow-lg">
      <div className="text-wedding-500 font-bold text-2xl">
        {config.couple.bride} & {config.couple.groom}
      </div>
      
      <div className="flex gap-4">
        <a href="#home">Home</a>
        {config.features.showOurStory && <a href="#historia">Nossa História</a>}
        {config.features.showGiftList && <a href="#presentes">Presentes</a>}
        {config.features.showRSVP && <a href="#confirmar">Confirmar Presença</a>}
      </div>
    </nav>
  );
}
```

### Ceremony Details Component

```typescript
import { useCouple } from '../../contexts/CoupleContext';

function CeremonyDetails() {
  const { config } = useCouple();

  return (
    <div>
      <h2>Cerimônia</h2>
      
      <div>
        <p>Data: {config.ceremony.date}</p>
        <p>Horário: {config.ceremony.time}</p>
        <p>Local: {config.ceremony.venue.name}</p>
        <p>Endereço: {config.ceremony.venue.address}, {config.ceremony.venue.city} - {config.ceremony.venue.state}</p>
      </div>
      
      <a 
        href={config.ceremony.venue.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-wedding-500 text-white px-6 py-3 rounded-lg"
      >
        Como chegar
      </a>
    </div>
  );
}
```

### Admin Route Component

```typescript
import { useCouple } from '../../contexts/CoupleContext';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { config } = useCouple();
  const [user] = useAuthState(auth);

  const isAdmin = user && config.admins.includes(user.email || '');

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```

---

## 🔥 7. Firebase Multi-Tenant

### Estrutura de Collections

```typescript
// Cada casal tem suas próprias sub-collections
const getCoupleRef = (slug: string) => {
  return doc(db, 'couples', slug);
};

// Presentes
const getGiftsRef = (slug: string) => {
  return collection(db, `couples/${slug}/gifts`);
};

// Convidados
const getGuestsRef = (slug: string) => {
  return collection(db, `couples/${slug}/guests`);
};

// Confirmações
const getRSVPRef = (slug: string) => {
  return collection(db, `couples/${slug}/rsvp`);
};

// Uso
const { config } = useCouple();
const giftsRef = getGiftsRef(config.couple.slug);
const gifts = await getDocs(giftsRef);
```

---

## 🚀 8. Fluxo de Criação de Novo Casal

### Passo 1: Criar arquivo de configuração

```bash
# Criar novo arquivo em src/config/couples/
touch src/config/couples/joao-maria.config.ts
```

### Passo 2: Preencher configuração

```typescript
import { CoupleConfig } from '../types/coupleConfig.types';

export const joaoMariaConfig: CoupleConfig = {
  couple: {
    bride: "Maria",
    groom: "João",
    weddingDate: "2026-08-15",
    slug: "joao-maria"
  },
  theme: {
    primary: "#4A90E2",      // Azul
    secondary: "#7BB3FF",
    accent: "#B3D9FF",
    background: "#F0F7FF"
  },
  // ... resto da configuração
};
```

### Passo 3: Atualizar current.config.ts

```typescript
// src/config/current.config.ts
import { joaoMariaConfig } from './couples/joao-maria.config';

export const currentCoupleConfig = joaoMariaConfig;
```

### Passo 4: Upload de Assets

```bash
# Fazer upload das fotos do casal em src/assets/
# Atualizar os caminhos na configuração
```

### Passo 5: Deploy

```bash
npm run build
firebase deploy
```

---

## 📊 9. Vantagens da Arquitetura

### ✅ Escalabilidade
- Adicionar novos casais é simples (só criar novo config)
- Não precisa duplicar código
- Facilita manutenção

### ✅ Personalização
- Cada casal tem cores únicas
- Mensagens personalizadas
- Features ativadas/desativadas por casal

### ✅ Type Safety
- TypeScript garante que nada seja esquecido
- Autocomplete em toda a aplicação
- Menos bugs em produção

### ✅ Separação de Dados
- Firebase isolado por casal (slug)
- Segurança de dados
- Fácil backup/migração

### ✅ Manutenibilidade
- Um lugar centralizado para configurações
- Fácil de encontrar e alterar
- Documentação embutida

---

## 🎯 10. Próximos Passos

### Fase 1: Refatoração Atual
1. Criar estrutura de pastas
2. Migrar código atual para usar Context
3. Criar configuração do Vitória & Yuri
4. Testar todas as funcionalidades

### Fase 2: Multi-Tenant
1. Implementar roteamento por slug
2. Adaptar Firebase para multi-tenant
3. Criar segundo casal de teste
4. Validar isolamento de dados

### Fase 3: Admin Panel
1. Interface para criar novo casal
2. Upload de fotos
3. Color picker para paleta
4. Preview em tempo real
5. Geração automática de config

### Fase 4: Comercialização
1. Landing page de vendas
2. Sistema de pagamento
3. Painel de controle para casais
4. Documentação para clientes

---

## 💡 Dicas de Implementação

### 1. Sempre use o hook `useCouple()`
```typescript
const { config } = useCouple();
// Nunca importar diretamente a configuração
```

### 2. Use CSS Variables para cores
```typescript
// Permite mudança dinâmica sem rebuild
style={{ color: 'var(--color-primary)' }}
```

### 3. Feature Flags
```typescript
{config.features.showGiftList && <GiftList />}
```

### 4. Fallbacks
```typescript
config.social?.instagram ?? 'Não informado'
```

---

## 📞 Suporte

Para implementar esta arquitetura, comece pela **Fase 1** e vá incrementalmente.

Quer ajuda para implementar alguma parte específica? 🚀
