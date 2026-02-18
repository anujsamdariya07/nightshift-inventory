import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      organizationName,
      customerId,
      customerName,
      employeeId,
      employeeName,
      orderId,
      orderDate,
      deadline,
      items,
      additionalNotes,
    } = body;

    // Read the template file
    const templatePath = path.join(
      process.cwd(),
      'src',
      'app',
      'api',
      'generate-pdf',
      'template.html',
    );
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Generate Items Table
    let itemsHtml = '';
    let totalAmount = 0;

    items.forEach((item: any) => {
      const itemTotal = item.quantity * item.costPerUnit;
      totalAmount += itemTotal;

      itemsHtml += `
        <tr>
          <td>${item.itemId}</td>
          <td>${item.itemName}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">₹${item.costPerUnit}</td>
          <td class="text-right">₹${itemTotal}</td>
        </tr>
      `;
    });

    // Optional Notes Section
    let notesSection = '';

    if (additionalNotes && additionalNotes.trim() !== '') {
      notesSection = `
        <div class="notes">
          <strong>Additional Notes:</strong>
          <p>${additionalNotes}</p>
        </div>
      `;
    }

    // Replace Placeholders
    let finalHtml = htmlTemplate
      .replace('{{organizationName}}', organizationName)
      .replace('{{customerId}}', customerId)
      .replace('{{customerName}}', customerName)
      .replace('{{employeeId}}', employeeId)
      .replace('{{employeeName}}', employeeName)
      .replace('{{orderId}}', orderId)
      .replace('{{orderDate}}', orderDate)
      .replace('{{deadline}}', deadline)
      .replace('{{items}}', itemsHtml)
      .replace('{{totalAmount}}', `₹${totalAmount}`)
      .replace('{{notesSection}}', notesSection);

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

    // Generate PDF as buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${orderId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        error: 'Invoice generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
