import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1a1a1a', paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#666' },
  table: { display: "table", width: "100%", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: '#eee', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#000' },
  
  // Penyesuaian Lebar Kolom (Total 100%)
  colNo: { width: '5%' },
  colRef: { width: '25%' },      // Diperlebar agar Reference Code aman
  colDate: { width: '13%' },     // Diatur agar pas untuk tanggal DD/MM/YYYY
  colProduct: { width: '27%' },  // Ruang luas untuk Nama Produk
  colQty: { width: '10%' },
  colSupplier: { width: '20%' },
  
  cellHeader: { fontWeight: 'bold', padding: 4 },
  cell: { 
    padding: 4, 
    wordBreak: 'break-all', 
    flexWrap: 'wrap' 
  }
});

const MovementPDF = ({ data, user, filters,type,outbound }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{type === "IN" ? "INBOUND REPORT" : `${outbound === "User" ? "OUTBOUND REQUEST REPORT" : `${outbound === "Admin" ? "OUTBOUND ADMIN REPORT" : "ALL OUTBOUND REPORT"}`}`}</Text>
        <Text style={styles.subtitle}>Periode: {filters.startDate || 'Semua'} - {filters.endDate || 'Semua'}</Text>
        <Text style={styles.subtitle}>Dicetak oleh: {user?.name || user?.roles} | {new Date().toLocaleString('id-ID')}</Text>
      </View>

      <View style={styles.table}>
        {/* Header Tabel */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.colNo, styles.cellHeader]}>No</Text>
          <Text style={[styles.colRef, styles.cellHeader]}>Reference Code</Text>
          <Text style={[styles.colDate, styles.cellHeader]}>Date</Text>
          <Text style={[styles.colProduct, styles.cellHeader]}>Product Name</Text>
          <Text style={[styles.colQty, styles.cellHeader]}>Quantity</Text>
          <Text style={[styles.colSupplier, styles.cellHeader]}>{type === "IN" ? "Supplier" : "Customer"}</Text>
        </View>

        {/* Data Rows */}
        {data.map((m, i) => (
          <View style={styles.tableRow} key={i}>
            <Text style={[styles.colNo, styles.cell]}>{i + 1}</Text>
            {/* Menggunakan View pembungkus pada teks panjang agar wrap berfungsi maksimal */}
            <View style={styles.colRef}><Text style={styles.cell}>{m.referenceCode}</Text></View>
            <Text style={[styles.colDate, styles.cell]}>{new Date(m.createdAt).toLocaleDateString('id-ID')}</Text>
            <View style={styles.colProduct}><Text style={styles.cell}>{m.product?.name}</Text></View>
            <Text style={[styles.colQty, styles.cell]}>{m.quantity}</Text>
            <View style={styles.colSupplier}><Text style={styles.cell}>{type === "IN" ? m.supplier?.name : m.customer?.name}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default MovementPDF;