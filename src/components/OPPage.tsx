import React from 'react';
import { OrderData, OrderItem } from '../services/geminiService';

interface OPPageProps {
  order: OrderData;
  item: OrderItem;
  pageNumber: number;
  totalPages: number;
}

export const OPPage: React.FC<OPPageProps> = ({ order, item, pageNumber, totalPages }) => {
  const formatQty = (qty: number) => {
    const n = Math.floor(Number(qty));
    return `${n.toString().padStart(2, '0')} ${n === 1 ? 'PÇ' : 'PÇS'}`;
  };

  return (
    <div className="bg-white w-[210mm] h-[296.5mm] p-[10mm] mx-auto shadow-lg border border-gray-200 mb-8 print:mb-0 print:shadow-none print:border-none flex flex-col font-sans text-[10pt] text-black overflow-hidden box-border print-break-after pdf-page page">
      {/* Header */}
      <div className="border border-black p-2 text-center font-bold text-lg mb-0 uppercase tracking-wider">
        DIMENSÃO ILUMINAÇÃO
      </div>

      <div className="flex border-x border-b border-black flex-1 min-h-0 overflow-hidden">
        <div className="w-[15%] border-r border-black p-4 flex items-start justify-center font-bold text-lg pt-10">
          {formatQty(item.quantity)}
        </div>
        <div className="w-[85%] p-4 relative flex flex-col min-h-0">
          <div className="font-bold mb-4 text-[11pt] leading-tight pr-24 flex-none">
            {formatQty(item.quantity)} – {item.code} - {item.description.toUpperCase()}
          </div>
          
          <div className="space-y-1 mb-4 font-bold flex-none">
            <p>Janela de Inspeção – Sim ({item.hasInspectionWindow ? 'X' : ' '}) Não ({!item.hasInspectionWindow ? 'X' : ' '})</p>
            <p>Pintura – Sim ({item.hasPainting ? 'X' : ' '}) Não ({!item.hasPainting ? 'X' : ' '}) – Cor: {item.hasPainting && item.paintingColor ? item.paintingColor.toUpperCase() : '_________________'}</p>
            <p>Coleta ({order.deliveryType === 'Coleta' ? 'X' : ' '}) - Entrega ({order.deliveryType === 'Entrega' ? 'X' : ' '}) - Cliente Retira ({order.deliveryType === 'Cliente Retira' ? 'X' : ' '})</p>
          </div>

          <div className="text-center font-bold mb-4 text-[11pt] flex-none">CONFORME DESENHO ANEXO.</div>

          <div className="font-bold mb-1 flex-none">DESCRIÇÃO DE TODOS OS MATERIAIS:</div>
          <div className="space-y-0.5 text-[10pt] font-bold overflow-hidden flex-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="leading-tight">
                {formatQty(it.quantity)} – {it.code} - {it.description.toUpperCase()}
              </div>
            ))}
            {/* Uma linha em branco abaixo do último item */}
            <div className="h-[1.2em]"></div>
          </div>

          {/* "Copia Controlada" Watermark - Only text, no box */}
          <div 
            className="absolute top-2 right-2 rotate-[-10deg] font-bold text-lg tracking-tighter pointer-events-none select-none z-50 bg-transparent"
            style={{ 
              color: 'rgba(209, 213, 219, 0.25)'
            }}
          >
            Copia Controlada
          </div>
        </div>
      </div>

      <div className="border-x border-b border-black p-2 text-center font-bold text-[11pt]">
        VENDIDO POR: {order.seller}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 border-x border-b border-black">
        <div className="p-2 border-r border-black flex gap-2">
          <span className="font-bold">CLIENTE:</span> 
          <span className="uppercase">{order.clientName}</span>
        </div>
        <div className="p-2 flex gap-2">
          <span className="font-bold">DATA PEDIDA:</span> {order.printDate}
        </div>
      </div>
      <div className="grid grid-cols-2 border-x border-b border-black">
        <div className="p-2 border-r border-black flex gap-2">
          <span className="font-bold">PEDIDO:</span> {order.orderNumber}
        </div>
        <div className="p-2 flex gap-2">
          <span className="font-bold">DATA ENTREGA:</span> {order.deliveryDate}
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-3 border-x border-b border-black min-h-[80px] flex-shrink">
        <div className="p-2 border-r border-black flex flex-col justify-between">
          <div className="font-bold text-[11pt]">PROJETO: <span className="ml-4 font-normal">{new Date().toLocaleDateString('pt-BR')}</span></div>
          <div className="pb-1 text-[10pt]">
            <span className="font-bold">Ass:</span> __________________________
          </div>
        </div>
        <div className="p-2 border-r border-black flex flex-col justify-between">
          <div className="font-bold text-[11pt]">CONFERENCIA: <span className="ml-4 font-normal">____/____/____</span></div>
          <div className="pb-1 text-[10pt]">
            <span className="font-bold">Ass:</span> __________________________
          </div>
        </div>
        <div className="p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt]">PRODUÇÃO: <span className="ml-4 font-normal">____/____/____</span></div>
          <div className="pb-1 text-[10pt]">
            <span className="font-bold">Ass:</span> ________________________
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-3 border-x border-b border-black min-h-[140px] flex-shrink">
        {/* Corte */}
        <div className="border-r border-black p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1">CORTE</div>
          <div className="text-[10pt] space-y-2">
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Inicío Ordem:</span> <span className="font-normal">____/____/____</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Final Prod.</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="pt-2">
              <span className="font-bold">Ass:</span> __________________________
            </div>
          </div>
        </div>
        {/* Montagem */}
        <div className="border-r border-black p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1 text-center">MONTAGEM</div>
          <div className="text-[10pt] space-y-2">
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Rec. Ordem:</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Final Prod.</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="pt-2">
              <span className="font-bold">Ass:</span> __________________________
            </div>
          </div>
        </div>
        {/* Solda */}
        <div className="p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1 text-center">SOLDA</div>
          <div className="text-[10pt] space-y-2">
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Rec. Ordem:</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold">Data Final Prod.</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="pt-2">
              <span className="font-bold">Ass:</span> ________________________
            </div>
          </div>
        </div>
      </div>

      {/* Finishing Steps */}
      <div className="grid grid-cols-3 border-x border-b border-black min-h-[160px] flex-shrink">
        {/* Galvanização */}
        <div className="border-r border-black p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1">GALVANIZAÇÃO / ______________</div>
          <div className="text-[9pt] space-y-2 mt-1">
            <div>Data de conferência ida: <span className="font-normal">____/____/____</span></div>
            <div><span className="font-bold">Nome:</span> __________________________</div>
            <div>Data de conferência retorno: <span className="font-normal">____/____/____</span></div>
            <div><span className="font-bold">Nome:</span> __________________________</div>
          </div>
        </div>
        {/* Pintura */}
        <div className="border-r border-black p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1">PINTURA / _____________________</div>
          <div className="text-[9pt] space-y-2 mt-1">
            <div>Data de conferência ida: <span className="font-normal">____/____/____</span></div>
            <div><span className="font-bold">Nome:</span> __________________________</div>
            <div>Data de conferência retorno: <span className="font-normal">____/____/____</span></div>
            <div><span className="font-bold">Nome:</span> __________________________</div>
          </div>
        </div>
        {/* Finalização */}
        <div className="p-2 flex flex-col justify-between">
          <div className="font-bold text-[11pt] mb-1 text-center uppercase">Finalização</div>
          <div className="text-[10pt] space-y-4 flex flex-col justify-start mt-1">
            <div className="flex items-end gap-1">
              <span className="font-bold">Produto finalizado:</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold">Faturamento:</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-bold">Entrega:</span> <span className="ml-auto font-normal">____/____/____</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto pt-2 text-[9pt] border-t border-transparent">
        <div>F07- ORDEM DE SERVIÇO – REV06 – 16/01/2025</div>
        <div className="font-bold uppercase">PG: {pageNumber}/{totalPages}</div>
      </div>
    </div>
  );
};
