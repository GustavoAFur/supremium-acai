import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Cadastrar",
    url: "/register",
    icon: Inbox,
  },
  {
    title: "Pedidos",
    url: "/orders",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cantinna</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                {/* Menu Item Principal */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {/* Ícone ou texto para o botão */}
                      <span>Produtos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* Conteúdo Expansível */}
                  <CollapsibleContent className="pl-4">
                    <SidebarMenuSub>
                      {/* Subitens do Menu */}
                      <SidebarMenuSubItem>
                        <a
                          href="/products/create"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Cadastrar
                        </a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a
                          href="/products/edit"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Editar
                        </a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible>
                {/* Menu Item Principal */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {/* Ícone ou texto para o botão */}
                      <span>Pedidos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* Conteúdo Expansível */}
                  <CollapsibleContent className="pl-4">
                    <SidebarMenuSub>
                      {/* Subitens do Menu */}
                      <SidebarMenuSubItem>
                        <a
                          href="/orders?status=aberto"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Abertos
                        </a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a
                          href="/orders?status=em-andamento"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Em andamento
                        </a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a
                          href="/orders?status=fechado"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Fechados
                        </a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a
                          href="/orders?status=cancelado"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Cancelados
                        </a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="items-end">
          <SidebarMenuItem>
            <UserButton showName />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
