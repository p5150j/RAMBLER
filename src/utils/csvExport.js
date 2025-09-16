// utils/csvExport.js

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape if contains comma, quotes, or newlines
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Get all unique keys from the data
  const headers = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Create CSV header row
  const csvHeader = headers.map(escapeCSV).join(',');

  // Create CSV data rows
  const csvRows = data.map(row =>
    headers.map(header => escapeCSV(row[header])).join(',')
  );

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatEventRegistrationsForCSV = (registrations) => {
  const formattedData = [];

  registrations.forEach((registration) => {
    // For team events with multiple members
    if (registration.members && registration.members.length > 0) {
      registration.members.forEach((member, index) => {
        formattedData.push({
          'Registration ID': registration.id,
          'Event': registration.eventDetails?.title || '',
          'Event Date': registration.eventDetails?.date || '',
          'Event Location': registration.eventDetails?.location || '',
          'Event Type': registration.eventDetails?.eventType || '',
          'Team/Individual #': index + 1,
          'Name': member.name || '',
          'Email': member.email || '',
          'Phone': member.phone || '',
          'Emergency Contact': member.emergencyContact || '',
          'Shirt Size': registration.shirtDetails?.[index]?.size || 'N/A',
          'Shirt Collected': registration.shirtDetails?.[index]?.collected ? 'Yes' : 'No',
          'Total Cost': `$${registration.totalCost || 0}`,
          'Payment Status': registration.paymentStatus || 'unpaid',
          'Registration Status': registration.status || 'pending',
          'Registered At': new Date(registration.registeredAt).toLocaleString(),
          'Transaction ID': registration.paymentDetails?.transactionId || '',
          'Checked In': registration.checkedIn ? 'Yes' : 'No'
        });
      });
    } else {
      // Fallback for registrations without members array
      formattedData.push({
        'Registration ID': registration.id,
        'Event': registration.eventDetails?.title || '',
        'Event Date': registration.eventDetails?.date || '',
        'Event Location': registration.eventDetails?.location || '',
        'Event Type': registration.eventDetails?.eventType || '',
        'Name': registration.name || '',
        'Email': registration.email || '',
        'Phone': registration.phone || '',
        'Total Cost': `$${registration.totalCost || 0}`,
        'Payment Status': registration.paymentStatus || 'unpaid',
        'Registration Status': registration.status || 'pending',
        'Registered At': new Date(registration.registeredAt).toLocaleString(),
        'Transaction ID': registration.paymentDetails?.transactionId || '',
        'Checked In': registration.checkedIn ? 'Yes' : 'No'
      });
    }
  });

  return formattedData;
};