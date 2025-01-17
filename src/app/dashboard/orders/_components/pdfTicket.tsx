"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Order } from "../page";

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 18,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
  section: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
  },
  header: {
    paddingVertical: 14,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 8,
  },
  sectionProdsTitle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    width: "100%",
  },
  separatorText: {
    fontSize: 12,
  },
  clientInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientInfoText: {
    fontSize: 8,
  },
  paymentInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentInfoText: {
    fontSize: 8,
    textTransform: "capitalize",
  },
});

// Create Document Component
export const PdfTicket = ({ order }: { order: Order }) => (
  <Document style={{ backgroundColor: "red" }}>
    <Page size={{ width: 58 * 2.83465 }} style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Supremium Açaí</Text>
        <Text style={styles.subTitle}>RUA SAO JOSE 00457</Text>
        <Text style={styles.subTitle}>CENTRO RERIUTABA</Text>
      </View>

      <View style={styles.separator}>
        <Text style={styles.separatorText}>
          - - - - - - - - - - - - - - - - - -
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>ID: {order.id}</Text>
        <Text style={styles.subTitle}>
          Data: {order.createdAt.toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View style={styles.separator}>
        <Text style={styles.separatorText}>
          - - - - - - - - - - - - - - - - - -
        </Text>
      </View>

      <View style={styles.sectionProdsTitle}>
        <Text style={styles.subTitle}>Item</Text>
        <Text style={styles.subTitle}>Qtd</Text>
        <Text style={styles.subTitle}>Vl.Total</Text>
      </View>

      <View style={{ width: "100%" }}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.sectionProdsTitle}>
            <Text style={styles.subTitle}>{item.name}</Text>
            <Text style={styles.subTitle}>{item.quantity}</Text>
            <Text style={styles.subTitle}>
              {item.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.separator}>
        <Text style={styles.separatorText}>
          - - - - - - - - - - - - - - - - - -
        </Text>
      </View>

      <View style={styles.sectionProdsTitle}>
        <Text style={{ fontSize: 12 }}>Valor total:</Text>
        <Text style={{ fontSize: 10 }}>
          {order.totalPrice.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>

      <View style={styles.separator}>
        <Text style={styles.separatorText}>
          - - - - - - - - - - - - - - - - - -
        </Text>
      </View>

      <View style={styles.separator}>
        <Text style={{ fontSize: 12 }}>Inf. Cliente</Text>
      </View>

      <View style={{ width: "100%" }}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientInfoText}>Nome:</Text>
          <Text style={styles.clientInfoText}>{order.name.slice(0, 15)}</Text>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientInfoText}>Pedido:</Text>
          <Text style={styles.clientInfoText}>{order.orderType}</Text>
        </View>

        {order.orderType === "delivery" && (
          <>
            <View style={styles.clientInfo}>
              <Text style={styles.clientInfoText}>Endereco:</Text>
              <Text style={styles.clientInfoText}>
                {order.deliveryInfo.address.slice(0, 20)}
              </Text>
            </View>

            <View style={styles.clientInfo}>
              <Text style={styles.clientInfoText}>Comp:</Text>
              <Text style={styles.clientInfoText}>
                {order.deliveryInfo.complement.slice(0, 20)}
              </Text>
            </View>

            <View style={styles.clientInfo}>
              <Text style={styles.clientInfoText}>Tel:</Text>
              <Text style={styles.clientInfoText}>
                {order.deliveryInfo.phone}
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <Text style={styles.clientInfoText}>Obs:</Text>
              <Text style={{ fontSize: 10 }}>
                {order.deliveryInfo.observation}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.separator}>
        <Text style={styles.separatorText}>
          - - - - - - - - - - - - - - - - - -
        </Text>
      </View>

      <View style={styles.separator}>
        <Text style={{ fontSize: 12 }}>Inf. Pagamento</Text>
      </View>

      {order.status === "fechado" && (
        <View style={{ width: "100%" }}>
          {order.paymentInfo.paymentMethod.map((item, index) => (
            <View key={index} style={styles.paymentInfo}>
              <Text style={styles.paymentInfoText}>{item.methodPayment}</Text>
              <Text style={styles.paymentInfoText}>
                {parseFloat(item.value).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
          ))}

          <View style={styles.separator}>
            <Text style={styles.separatorText}>
              - - - - - - - - - - - - - - - - - -
            </Text>
          </View>

          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoText}>Total pag:</Text>
            <Text style={styles.paymentInfoText}>
              {order.paymentInfo.totalPayed.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>

          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoText}>Troco:</Text>
            <Text style={styles.paymentInfoText}>
              {order.paymentInfo.transshipment.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>
      )}
    </Page>
  </Document>
);
