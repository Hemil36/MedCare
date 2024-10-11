import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import CryptoJS from 'crypto-js';

// Custom styles reflecting the uploaded image
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#f7f7f7',
    border: '1px solid #e0e0e0',
    color: '#333',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  headerLeft: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    fontSize: 10,
    textAlign: 'right',
    color: '#555',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  patientInfo: {
    fontSize: 11,
    marginBottom: 5,
    color: '#333',
  },
  diagnosis: {
    fontSize: 14,
    color: '#2b5797', // Professional dark blue shade
    marginBottom: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableRowHeader: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 10,
  },
  tableColHeader: {
    fontWeight: 'bold',
    color: '#0a58ca',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: 5,
  },
  tableCol: {
    width: '20%',
    textAlign: 'left',
    paddingLeft: 8,
    fontSize: 10,
  },
  tableColWide: {
    width: '40%',
  },
  footer: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #ddd',
  },
  followUp: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2b5797',
    marginTop: 25,
  },
});

// Prescription PDF component
const ProfessionalPrescriptionPDF = ({ data }) => {
  const { patientName,  contactNumber, diagnosis, medicines, notes } = data;
  const hash = generateHash({ patientName, diagnosis, medicines, followUpDate });

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>MedCare</Text>
            <Text>Patient : {patientName}</Text>
            <Text>Contact Number : +{contactNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Prescription Date: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Diagnosis */}
        <Text style={styles.diagnosis}>DIAGNOSIS: {diagnosis}</Text>

        {/* Prescription Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableRowHeader]}>
            <Text style={[styles.tableColHeader, { width: '10%' }]}>#</Text>
            <Text style={[styles.tableColHeader, styles.tableColWide]}>Medication</Text>
            <Text style={styles.tableColHeader}>Dose</Text>
            <Text style={styles.tableColHeader}>Frequency</Text>
            <Text style={styles.tableColHeader}>Duration</Text>
          </View>

          {/* Table Rows for Medicines */}
          {medicines.map((med, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, { width: '10%' }]}>{index + 1}</Text>
              <Text style={[styles.tableCol, styles.tableColWide]}>{med.name}</Text>
              <Text style={styles.tableCol}>{med.dose}</Text>
              <Text style={styles.tableCol}>{med.frequency}</Text>
              <Text style={styles.tableCol}>{med.duration}</Text>
            </View>
          ))}
        </View>

        {/* Remarks Section */}
          <View  style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 10, color: '#555' }}>
              <Text style={{ fontWeight: 'bold' }}>{index + 1}. Remarks: </Text>
              {notes}
            </Text>
          </View>
        

        {/* Footer */}
        <Text style={styles.footer}>
          This is a digitally generated prescription.
        </Text>
        <Text style={styles.footer}>
          Digital Signature : {hash}
        </Text>
      </Page>
    </Document>
  );
};

const generateHash = (data) => {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
};

export default ProfessionalPrescriptionPDF;