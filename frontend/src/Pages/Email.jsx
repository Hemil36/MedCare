import { Activity } from 'lucide-react';
import React from 'react'


export default function OTPEmail({
    otp = '123456',
    expirationTime = '10 minutes',
  }) {
    return (
      <div style={styles.main}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <Activity size={32} color="#3ECF8E" strokeWidth={2.5} />
              <p style={styles.logo}>MedID</p>
            </div>
            <div style={styles.headerAccent}></div>

          </div>
          <div style={styles.content}>
            <h1 style={styles.heading}>Your One-Time Password</h1>
            <p style={styles.paragraph}>
              Enter the following OTP to complete your action:
            </p>
            <div style={styles.otpContainer}>
              <p style={styles.otpText}>{otp}</p>
            </div>
            <p style={styles.expirationText}>
              This OTP expires in <span style={styles.highlight}>{expirationTime}</span>
            </p>
            
            <div style={styles.footnoteContainer}>
              <p style={styles.footnote}>
                If you didn't request this code, please ignore this email or contact our support team if you have any concerns.
              </p>
            </div>
          </div>
          <div style={styles.footer}>
            <p style={styles.footerText}>© 2024 MedID. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const styles = {
    main: {
        backgroundColor: '#1C1C1C',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerAccent: {
      position: 'absolute' ,
      bottom: '0',
      left: '0',
      right: '0',
      height: '2px',
      background: 'linear-gradient(90deg, #3ECF8E, #3ECFCF)',
    },
    container: {
      margin: '0 auto',
      width: '100%',
      maxWidth: '500px',
      backgroundColor: '#252525',

      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    },
    header: {
        backgroundColor: '#252525',
        padding: '24px',
        position: 'relative' ,
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logo: {
      color: '#FFFFFF',
      fontSize: '28px',
      fontWeight: '700',
      margin: '0',
      letterSpacing: '-0.5px',
    },
    content: {
      padding: '40px 32px',
    },
    heading: {
        color: '#FFFFFF',
        fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 16px',
      textAlign: 'center' ,
      letterSpacing: '-0.5px',
    },
    paragraph: {
        color: '#FFFFFF',
        fontSize: '16px',
      lineHeight: '24px',
      margin: '0 0 32px',
      textAlign: 'center' ,
    },
    otpContainer: {
      background: 'linear-gradient(135deg, #3ECF8E, #3ECFCF)',
      borderRadius: '12px',
      margin: '0 auto 24px',
      padding: '24px',
      textAlign: 'center' ,
      maxWidth: '240px',
      boxShadow: '0 4px 12px rgba(62, 207, 142, 0.2)',
    },
    otpText: {
      color: '#FFFFFF',
      fontSize: '36px',
      fontWeight: '700',
      letterSpacing: '8px',
      margin: '0',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    expirationText: {
        color: '#FFFFFF',
        fontSize: '14px',
      textAlign: 'center' ,
      margin: '0 0 32px',
    },
    highlight: {
      color: '#3ECF8E',
      fontWeight: '600',
    },
    button: {
      backgroundColor: '#3ECF8E',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600',
      textDecoration: 'none',
      textAlign: 'center' ,
      display: 'block',
      padding: '14px 24px',
      margin: '0 auto 32px',
      maxWidth: '200px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(62, 207, 142, 0.2)',
    },
    footnoteContainer: {
      borderTop: '1px solid #E0E0E0',
      marginTop: '32px',
      paddingTop: '24px',
    },
    footnote: {
        color: '#FFFFFF',
        fontSize: '14px',
      lineHeight: '20px',
      textAlign: 'center' ,
      margin: '0',
    },
    footer: {
        backgroundColor: '#252525',
        padding: '16px 24px',
      textAlign: 'center' ,
    },
    footerText: {
        color: '#FFFFFF',

      fontSize: '12px',
      margin: '0',
    },
  };



  
  
// export default function OTPEmail({
//     otp = '123456',
//     expirationTime = '10 minutes',
//   }) {
//     return (
//         <div style={styles.main}>
//         <div style={styles.container}>
//           <div style={styles.header}>
//             <div style={styles.logoContainer}>
//               <Activity size={28} color="#3ECF8E" />
//               <p style={styles.logo}>MedID</p>
//             </div>
//             <div style={styles.headerAccent}></div>
//           </div>
//           <div style={styles.content}>
//             <h1 style={styles.heading}>Your One-Time Password</h1>
//             <p style={styles.paragraph}>
//               Use the following OTP to complete your action:
//             </p>
//             <div style={styles.otpContainer}>
//               <p style={styles.otpText}>{otp}</p>
//             </div>
//             <p style={styles.paragraph}>
//               This OTP will expire in <span style={styles.highlight}>{expirationTime}</span>.
//             </p>
            
//             <div style={styles.footnoteContainer}>
//               <p style={styles.footnote}>
//                 If you didn't request this OTP, please ignore this email or contact support if you have concerns.
//               </p>
//             </div>
//           </div>
//           <div style={styles.footer}>
//             <p style={styles.footerText}>© 2023 MedID. All rights reserved.</p>
//           </div>
//         </div>
//       </div>
//     );
// }
//     const  styles = {
//     main: {
//       backgroundColor: '#1C1C1C',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
      
//     },
//     container: {
//         margin: '0 auto',
//         width: '100%',
//         maxWidth: '600px',
//         backgroundColor: '#252525',
//         borderRadius : '32px',
//         overflow: 'hidden',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               borderRadius : '32px',

//     },
//     header: {
//         backgroundColor: '#252525',
//       padding: '24px',
//       position: 'relative' ,
      
//     },
//     logoContainer: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//     },
//     logo: {
//       color: '#ffffff',
//       fontSize: '28px',
//       fontWeight: 'bold',
//       margin: '0',
//     },
//     headerAccent: {
//       position: 'absolute' ,
//       bottom: '0',
//       left: '0',
//       right: '0',
//       height: '4px',
//       background: 'linear-gradient(90deg, #3ECF8E, #3ECFCF)',
//     },
//     content: {
//       padding: '32px 24px',
//     },
//     heading: {
//       color: '#ffffff',
//       fontSize: '24px',
//       fontWeight: 'bold',
//       margin: '0 0 24px',
//       textAlign: 'center' ,
//     },
//     paragraph: {
//       color: '#ffffff',
//       fontSize: '16px',
//       lineHeight: '24px',
//       margin: '0 0 24px',
//       textAlign: 'center' ,
//     },
//     otpContainer: {
//       background: 'linear-gradient(135deg, #2C2C2C, #333333)',
//       borderRadius: '16px',
//       margin: '24px auto',
//       padding: '16px',
//       textAlign: 'center' ,
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//       maxWidth: '200px',
//     },
//     otpText: {
//       color: '#3ECF8E',
//       fontSize: '32px',
//       fontWeight: 'bold',
//       letterSpacing: '6px',
//       margin: '0',
//     },
//     highlight: {
//       color: '#3ECF8E',
//       fontWeight: 'bold',
//     },
//     button: {
//       backgroundColor: '#3ECF8E',
//       borderRadius: '4px',
//       color: '#1C1C1C',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       textDecoration: 'none',
//       textAlign: 'center' ,
//       display: 'block',
//       padding: '14px 24px',
//       margin: '32px auto',
//       maxWidth: '200px',
//       transition: 'background-color 0.3s ease',
//     },
//     footnoteContainer: {
//       borderTop: '1px solid #3ECF8E',
//       marginTop: '32px',
//       paddingTop: '16px',
//     },
//     footnote: {
//       color: '#AAAAAA',
//       fontSize: '14px',
//       lineHeight: '20px',
//       textAlign: 'center' ,
//       margin: '0',
//     },
//     footer: {
//         backgroundColor: '#252525',
//       padding: '16px 24px',
//       textAlign: 'center' ,
//     },
//     footerText: {
//       color: '#666666',
//       fontSize: '12px',
//       margin: '0',
//     },
//   };
  
  
  
  