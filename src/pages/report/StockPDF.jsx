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
  
  colNo: { width: '10%' },
  colCode: { width: '30%' },
  colName: { width: '45%' },
  colStock: { width: '15%' },
  
  cellHeader: { fontWeight: 'bold', padding: 4 },
  cell: { padding: 4, flexWrap: 'wrap' },
  // Tambahkan warna merah jika stok 0
  cellDanger: { padding: 4, color: 'red', fontWeight: 'bold' }
});

const StockPDF = ({ data, user, filter }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVENTORY STOCK REPORT</Text>
        <Text style={styles.subtitle}>Filter Status: {filter || 'All'}</Text>
        <Text style={styles.subtitle}>Dicetak oleh: {user?.name || user?.roles} | {new Date().toLocaleString('id-ID')}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.colNo, styles.cellHeader]}>No</Text>
          <Text style={[styles.colCode, styles.cellHeader]}>Product Code</Text>
          <Text style={[styles.colName, styles.cellHeader]}>Product Name</Text>
          <Text style={[styles.colStock, styles.cellHeader]}>Stock</Text>
        </View>

        {data.map((p, i) => (
          <View style={styles.tableRow} key={p.id}>
            <Text style={[styles.colNo, styles.cell]}>{i + 1}</Text>
            <View style={styles.colCode}><Text style={styles.cell}>{p.productCode}</Text></View>
            <View style={styles.colName}><Text style={styles.cell}>{p.name}</Text></View>
            <Text style={[styles.colStock, p.stock <= 0 ? styles.cellDanger : styles.cell]}>
              {p.stock}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default StockPDF;