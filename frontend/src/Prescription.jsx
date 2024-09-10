import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Custom professional styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8f8f8',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1 solid #eee',
    paddingBottom: 10,
  },
  headerLeft: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    fontSize: 10,
    textAlign: 'right',
    color: '#888',
  },
  patientInfo: {
    fontSize: 11,
    marginBottom: 5,
    color: '#333',
  },
  diagnosis: {
    fontSize: 12,
    color: '#3A42D1', // Professional blue shade
    marginBottom: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  tableRowHeader: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
  },
  tableColHeader: {
    fontWeight: 'bold',
    color: '#6A008A',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: 8,
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
    paddingTop: 10,
    borderTop: '1 solid #eee',
  },
  followUp: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3A42D1',
    marginTop: 20,
  },
});

// Professional Prescription PDF component
const ProfessionalPrescriptionPDF = ({ data }) => {
  const { patientName, patientAge, contactNumber, diagnosis, medicines, followUpDate } = data;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text>{patientName}, Male, {patientAge} year(s)</Text>
            <Text>+{contactNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Prescription Date: {new Date().toLocaleDateString()}</Text>
            <Text>Consultation Time: 11:32AM</Text>
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
        {medicines.map((med, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 10, color: '#555' }}>
              <Text style={{ fontWeight: 'bold' }}>{index + 1}. Remarks: </Text>
              {med.remarks}
            </Text>
          </View>
        ))}

        {/* Follow-up Information */}
        <Text style={styles.followUp}>FOLLOW-UP: Visit on {followUpDate}</Text>

        {/* Footer */}
        <Text style={styles.footer}>
          This is a digitally generated prescription.
        </Text>
      </Page>
    </Document>
  );
};

// Main Component to download the PDF
const ProfessionalPrescriptionGenerator = () => {
  // Prescription data
  const prescriptionData = {
    patientName: 'Hemil Dudhat',
    patientAge: 19,
    contactNumber: '919265640388',
    diagnosis: 'Chicken Pox',
    medicines: [
      {
        name: 'Dermocalm Lotion (lotion)',
        dose: '1 application',
        frequency: '0-0-1',
        duration: '5 Days',
        remarks: '1 એપ્લિકેશન લે - રાત્રે, 5 દિવસ માટે.',
      },
      {
        name: 'Becosules Z Capsule (capsule)',
        dose: '1 capsule',
        frequency: '0-1-0 After Meal',
        duration: '10 Days',
        remarks: '1 કેપ્સ્યુલ - બપોરનું ભોજન પછી, 10 દિવસ.',
      },
      {
        name: 'Ocuvir 400 Dt Tablet (Acyclovir 400mg)',
        dose: '1 tablet',
        frequency: '1-1-1 After Meal',
        duration: '5 Days',
        remarks: '1ટેબ્લેટ લો - દિવસમાં 4 પળે, 5 દિવસ માટે.',
      },
      {
        name: 'Prugo 10 Tablet (Hydroxyzine 10mg)',
        dose: '1 tablet',
        frequency: '1-0-1 After Meal',
        duration: '5 Days',
        remarks: '1ટેબ્લેટ - સવાર નાસ્તા પછી અને રાત્રે.',
      },
    ],
    followUpDate: 'Thu Jan 04 2024',
  };

  return (
    <div>
      <h1>Download Prescription PDF</h1>
      <PDFDownloadLink
        document={<ProfessionalPrescriptionPDF data={prescriptionData} />}
        fileName={`${prescriptionData.patientName}_Prescription.pdf`}
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download Professional Prescription PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default ProfessionalPrescriptionGenerator;
