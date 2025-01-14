import { ClipboardPenLine, HomeIcon, IceCreamBowl } from "lucide-react";

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
import Link from "next/link";
import SignOutButton from "../auth/_components/signoutButton";

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
                  <Link href="/" className="block p-2 hover:bg-gray-200">
                    <HomeIcon />
                    Inicio
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible>
                {/* Menu Item Principal */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <IceCreamBowl />
                      <span>Produtos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* Conteúdo Expansível */}
                  <CollapsibleContent className="pl-4">
                    <SidebarMenuSub>
                      {/* Subitens do Menu */}
                      <SidebarMenuSubItem>
                        <Link
                          href="/dashboard/products/create"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Cadastrar
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link
                          href="/dashboard/products/edit"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Editar
                        </Link>
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
                        <Link
                          href="/dashboard/orders/create"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Criar
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link
                          href="/dashboard/orders?status=aberto"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Abertos
                        </Link>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <Link
                          href="/dashboard/orders?status=fechado"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Fechados
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <Link
                          href="/dashboard/orders?status=cancelado"
                          className="block p-2 hover:bg-gray-200"
                        >
                          Cancelados
                        </Link>
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
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
