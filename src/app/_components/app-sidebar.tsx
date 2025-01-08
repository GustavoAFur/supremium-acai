import { ClipboardPenLine, DrumIcon, Drumstick, HomeIcon } from "lucide-react";

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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Supremium Açaí</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="block p-2 hover:bg-gray-200">
                    <HomeIcon />
                    Inicio
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible>
                {/* Menu Item Principal */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Drumstick />
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
                      <ClipboardPenLine />
                      <span>Pedidos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* Conteúdo Expansível */}
                  <CollapsibleContent className="pl-4">
                    <SidebarMenuSub>
                      {/* Subitens do Menu */}
                      <SidebarMenuSubItem>
                        <a
                          href="/orders/create"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Criar
                        </a>
                      </SidebarMenuSubItem>
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
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
