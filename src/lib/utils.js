import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import html2canvasPro from 'html2canvas-pro';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes, si = true, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

/**
 * Format number to string with comma separator
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Generates a PDF from an HTML element using html2canvas-pro
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {Object} [options={}] - Optional configuration for html2canvas-pro
 * @returns {Promise<jsPDF>} A promise that resolves with the generated PDF document
 */
export const generatePDF2 = async (element, options = {}) => {
    const defaultOptions = {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollY: -window.scrollY,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
        const canvas = await html2canvasPro(element, mergedOptions);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        return pdf;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @returns {Promise<jsPDF>} A promise that resolves with the generated PDF document
 */
export const generatePDF = async (element) => {
    const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    return pdf;
};
/**
 * Format date to Vietnamese date format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string in 'DD/MM/YYYY' format
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Set a date to local time without time part.
 * @param {string|Date} date - The input date.
 * @returns {Date|null} - Local date at midnight.
 */
export const setLocalDateWithoutTime = (date) => {
    if (!date) return null;
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    return localDate;
};

/**
 * Format date for server with 'YYYY-MM-DDT00:00:00.000Z' format.
 * @param {string|Date} date - The input date.
 * @returns {string|null} - Formatted date string.
 */
export const formatDateForServer = (date) => {
    if (!date) return null;
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
};