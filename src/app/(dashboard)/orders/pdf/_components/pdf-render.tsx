import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { OrderWithItems } from "@/types/orders";
import { formatPrice } from "@/lib/utils";

// Definir la cantidad máxima de ítems por página
const ITEMS_PER_PAGE = 5;

// Registrar fuentes
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "/fonts/Montserrat-Light.ttf", fontWeight: 300 },
    { src: "/fonts/Montserrat-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
    {
      src: "/fonts/Montserrat-Italic-VariableFont_wght.ttf",
      fontStyle: "italic",
    },
  ],
});

// Definir estilos
const styles = StyleSheet.create({
  page: {
    position: "relative",
    padding: "20px 20px 20px 20px", // Reducir el padding para más espacio
    fontFamily: "Montserrat",
  },
  pageBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10, // Reducir el margen inferior
  },
  contactInfo: {
    fontSize: 8, // Reducir el tamaño de la fuente
    textAlign: "right",
    color: "grey",
  },
  section: {
    marginBottom: 10, // Reducir el margen inferior
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 8, // Reducir el tamaño de la fuente
  },
  backgroundGrey: { backgroundColor: "#f4f4f4", padding: 3 }, // Reducir el padding
  italicText: {
    fontStyle: "italic",
    fontSize: 8, // Reducir el tamaño de la fuente
    color: "#222",
  },
  table: {
    width: "100%",
    marginTop: 5, // Reducir el margen superior
    marginBottom: 10, // Reducir el margen inferior
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center", // Centrar el texto
    paddingVertical: 2,
    fontSize: 7, // Reducir el tamaño de la fuente
  },
  tableCell: {
    padding: 3, // Reducir el padding
    fontSize: 7, // Reducir el tamaño de la fuente
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center", // Centrar el texto
  },
  truncate: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  totals: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginTop: 10, // Reducir el margen superior
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 8, // Reducir el tamaño de la fuente
    gap: 5,
    marginBottom: 5,
  },
  totalRowText: {
    fontSize: 8, // Reducir el tamaño de la fuente
    backgroundColor: "#f4f4f4",
    padding: 3, // Reducir el padding
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20, // Reducir la distancia desde el fondo
    left: 0,
    marginHorizontal: "20px", // Reducir el margen horizontal
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10, // Reducir el espacio entre elementos
    flex: 1,
  },
  image: {
    height: 20, // Reducir el tamaño de la imagen
    aspectRatio: 1,
    borderRadius: 3, // Reducir el radio del borde
    alignSelf: "flex-start",
  },
  commentSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  faqSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
    gap: 3,
  },
  faqItem: {
    marginBottom: 5,
  },
  text: {
    fontSize: 8,
    color: "#222",
  },
  footerSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ede202",
    color: "#222",
    textAlign: "center",
  },
});

// Función para dividir los ítems en páginas
const splitItemsIntoPages = (items: any[]) => {
  const pages = [];
  let currentPage: any[] = [];
  let currentPageItemCount = 0;

  const addItemToPage = (item: any, itemCount: number) => {
    if (currentPageItemCount + itemCount > ITEMS_PER_PAGE) {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageItemCount = 0;
    }
    currentPage.push(item);
    currentPageItemCount += itemCount;
  };

  items.forEach((item) => {
    addItemToPage(item, 1);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

// Componente principal
export const PDFRender = ({ order }: { order: OrderWithItems }) => {
  if (!order) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No hay datos de la orden</Text>
        </Page>
      </Document>
    );
  }

  // Dividir los ítems en páginas
  const pages = splitItemsIntoPages(order.items || []);

  // Calcular el total
  const total = order.items.reduce(
    (sum, item) => sum + parseFloat(item.price || "0"),
    0
  );

  // Filtrar ítems con comentarios
  const itemsWithComments = order.items.filter((item) => item.comment);

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={styles.page}
          orientation="landscape"
        >
          {/* Encabezado */}
          <View style={styles.header}>
            <Image
              src={`/images/decor-logo.png`}
              style={{ width: 100 }} // Reducir el ancho del logo
            />
            <Text style={{ fontSize: 7, fontWeight: 400 }}>
              {" "}
              {/* Reducir el tamaño de la fuente */}
              www.distribuidoresdecortinas.com.ar |
              distribuidoresdecortinas@gmail.com | +54 9 381 206-2408
            </Text>
          </View>

          {/* Client Info */}
          {pageIndex === 0 && (
            <>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.section}>
                  <Text style={styles.boldText}>CUIT: 30-71765031-6</Text>
                  <Text style={styles.boldText}>
                    Dirección: Anzorena 80, T4107EWB, T4107 Yerba Buena, Tucumán
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.boldText}>ORIGINAL</Text>

                  <Text style={styles.boldText}>
                    FECHA:{" "}
                    <Text style={{ fontWeight: 500 }}>
                      {new Date().toLocaleString("es-AR", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <View style={{ flexDirection: "column", width: "100%", gap: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={[styles.boldText, styles.backgroundGrey]}>
                      CLIENTE:{" "}
                    </Text>
                    <Text
                      style={[styles.backgroundGrey, { fontSize: 8, flex: 1 }]}
                    >
                      {order.client}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={[styles.boldText, styles.backgroundGrey]}>
                      N° Presupuesto:{" "}
                    </Text>
                    <Text
                      style={[styles.backgroundGrey, { fontSize: 8, flex: 1 }]}
                    >
                      {order.serial}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 5 }}>
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: 6,
                    fontWeight: 500,
                  }}
                >
                  Presupuesto No Valido Como Factura. Precios expresados en
                  pesos. Factura A O B.
                </Text>
              </View>
            </>
          )}

          {/* Tabla */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.boldText, styles.tableCell, { flex: 0.8 }]}>
                {" "}
                {/* Reducir el ancho */}
                Cantidad
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1.5 }]}>
                {" "}
                {/* Reducir el ancho */}
                Nombre
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Tipo
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Color
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1.5 }]}>
                {" "}
                {/* Reducir el ancho */}
                Dimensiones
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Soporte
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Caída
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Cadena
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Lado Cadena
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Apertura
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Pliegues
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Paños
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Accesorios
              </Text>
              <Text style={[styles.boldText, styles.tableCell, { flex: 1 }]}>
                Precio
              </Text>
            </View>

            {pageItems.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                  {item.qty}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.type || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.color || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                   {item.width} x {item.height} cm
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.support || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.fall || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.chain || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.chainSide || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.opening || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.pinches || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.panels || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.accessory || "-"}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {formatPrice(item.price)}
                </Text>
              </View>
            ))}
          </View>

          {/* Totales (solo en la última página) */}
          {pageIndex === pages.length - 1 && (
            <>
              <View style={styles.totals}>
                <View>
                  <View style={styles.totalRow}>
                    <Text style={[styles.boldText, styles.totalRowText]}>
                      Total:
                    </Text>
                    <Text style={[styles.boldText, styles.totalRowText]}>
                      {formatPrice(total)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Sección de Comentarios */}
              {(order.comment || itemsWithComments.length > 0) && (
                <View style={styles.commentSection}>
                  <Text style={styles.boldText}>Comentarios del Pedido:</Text>
                  {order.comment && (
                    <Text style={styles.text}>
                      <Text style={styles.boldText}>Comentario General:</Text>{" "}
                      {order.comment}
                    </Text>
                  )}
                  {itemsWithComments.map((item, index) => (
                    <Text key={index} style={styles.text}>
                      <Text style={styles.boldText}>{item.name}:</Text>{" "}
                      {item.comment}
                    </Text>
                  ))}
                </View>
              )}

              {/* Sección de Preguntas Frecuentes */}
              <View style={styles.faqSection}>
                <Text style={styles.boldText}>PREGUNTAS FRECUENTES:</Text>
                {[
                  {
                    title: "Métodos de Pago",
                    content:
                      "Transferencia/Efectivo: Pagando 60% de anticipo y 40% de saldo antes del envío.",
                  },
                  {
                    title: "Formas de Pago",
                    content: (
                      <Text>
                        <Text style={styles.text}>Anticipo 60% | Saldo 40% Contra entrega</Text>
                      </Text>
                    ),
                  },
                  {
                    title: "Plazo de entrega",
                    content:
                      "De 7 a 20 días hábiles (dependiendo del producto) desde la fecha de pago.",
                  },
                  {
                    title: "Garantía",
                    content: "Garantía por errores de fábrica.",
                  },
                  {
                    title: "Validez del presupuesto",
                    content:
                      "Presupuesto preliminar sujeto a modificaciones en caso de cambios en las medidas. Validez: 24hs.",
                  },
                  {
                    title: "¿Aceptan Dólares?",
                    content:
                      'Sí, aceptamos dólares. Referencia de valor: Precio de venta según "El cronista" al momento del pago.',
                  },
                  {
                    title: "¿Hacen Factura A?",
                    content:
                      "Sí, hacemos Factura A o B, es importante mencionarlo antes del pago.",
                  },
                ].map((item, index) => (
                  <View key={index} style={styles.faqItem}>
                    <Text style={styles.boldText}>{item.title}:</Text>
                    <Text style={styles.text}>{item.content}</Text>
                  </View>
                ))}
              </View>

              {/* Pie de Página */}
              <View style={styles.footerSection}>
                <Text style={styles.boldText}>
                  SOMOS DECORTINAS S.A.S - CUIT: 30-71765031-6
                </Text>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};
