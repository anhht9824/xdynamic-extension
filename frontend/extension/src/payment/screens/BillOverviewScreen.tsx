import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { paymentService } from "../../services/payment.service";
import { logger } from "../../utils";
import { useLanguageContext } from "../../providers/LanguageProvider";

type BillStatus = "paid" | "unpaid" | "overdue";

interface Bill {
  id: string;
  description: string;
  plan: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: BillStatus;
}

interface BillOverviewScreenProps {
  onSelectBill: (bill: Bill) => void;
  onBack: () => void;
}

const BillOverviewScreen: React.FC<BillOverviewScreenProps> = ({ onSelectBill, onBack }) => {
  const { language } = useLanguageContext();
  const tr = (vi: string, en: string) => (language === "vi" ? vi : en);

  const [bills, setBills] = useState<Bill[]>([]);
  const [filter, setFilter] = useState<"all" | BillStatus>("all");
  const [isLoading, setIsLoading] = useState(true);

  const copy = {
    headerTitle: tr("Hóa đơn & Thanh toán", "Bills & Payments"),
    headerSubtitle: tr("Quản lý các hóa đơn và thanh toán của bạn", "Manage your invoices and payments"),
    totalUnpaid: tr("Tổng chưa thanh toán", "Total unpaid"),
    paid: tr("Đã thanh toán", "Paid"),
    totalBills: tr("Tổng số hóa đơn", "Total bills"),
    filters: {
      all: tr("Tất cả", "All"),
      unpaid: tr("Chưa thanh toán", "Unpaid"),
      paid: tr("Đã thanh toán", "Paid"),
      overdue: tr("Quá hạn", "Overdue"),
    },
    table: {
      title: tr("Danh sách hóa đơn", "Bill list"),
      bill: tr("Hóa đơn", "Bill"),
      plan: tr("Gói dịch vụ", "Plan"),
      amount: tr("Số tiền", "Amount"),
      due: tr("Hạn thanh toán", "Due date"),
      status: tr("Trạng thái", "Status"),
      action: tr("Hành động", "Action"),
    },
    loading: tr("Đang tải hóa đơn...", "Loading bills..."),
    emptyTitle: tr("Không có hóa đơn", "No bills found"),
    emptyDesc: tr("Không tìm thấy hóa đơn nào phù hợp với bộ lọc.", "No bills match the current filters."),
    payNow: tr("Thanh toán", "Pay now"),
    statusText: {
      paid: tr("Đã thanh toán", "Paid"),
      unpaid: tr("Chưa thanh toán", "Unpaid"),
      overdue: tr("Quá hạn", "Overdue"),
      unknown: tr("Không xác định", "Unknown"),
    },
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const getBills = (paymentService as unknown as { getBills?: () => Promise<Bill[]> }).getBills;
        const data = typeof getBills === "function" ? await getBills() : [];
        setBills(Array.isArray(data) ? data : []);
      } catch (error) {
        logger.error("Failed to fetch bills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, []);

  const getFilteredBills = () => {
    if (filter === "all") return bills;
    return bills.filter((bill) => bill.status === filter);
  };

  const getStatusColor = (status: BillStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: BillStatus) => {
    switch (status) {
      case "paid":
        return copy.statusText.paid;
      case "unpaid":
        return copy.statusText.unpaid;
      case "overdue":
        return copy.statusText.overdue;
      default:
        return copy.statusText.unknown;
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: currency || "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US");

  const getTotalUnpaid = () =>
    bills
      .filter((bill) => bill.status === "unpaid" || bill.status === "overdue")
      .reduce((total, bill) => total + bill.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{copy.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{copy.headerTitle}</h1>
                <p className="text-sm text-gray-600">{copy.headerSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title={copy.totalUnpaid}
            value={formatCurrency(getTotalUnpaid(), "VND")}
            iconColor="text-red-600"
            iconBg="bg-red-100"
            iconPath="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
          />

          <SummaryCard
            title={copy.paid}
            value={String(bills.filter((b) => b.status === "paid").length)}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            iconPath="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          />

          <SummaryCard
            title={copy.totalBills}
            value={String(bills.length)}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            iconPath="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(["all", "unpaid", "paid", "overdue"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {copy.filters[filterType]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{copy.table.title}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>{copy.table.bill}</TableHeader>
                  <TableHeader>{copy.table.plan}</TableHeader>
                  <TableHeader>{copy.table.amount}</TableHeader>
                  <TableHeader>{copy.table.due}</TableHeader>
                  <TableHeader>{copy.table.status}</TableHeader>
                  <TableHeader>{copy.table.action}</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredBills().map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.description}</div>
                        <div className="text-sm text-gray-500">#{bill.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bill.plan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(bill.amount, bill.currency)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(bill.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                        {getStatusText(bill.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.status === "unpaid" || bill.status === "overdue" ? (
                        <Button onClick={() => onSelectBill(bill)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2" size="sm">
                          {copy.payNow}
                        </Button>
                      ) : (
                        <span className="text-green-600 font-medium">{copy.statusText.paid}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredBills().length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{copy.emptyTitle}</h3>
              <p className="mt-1 text-sm text-gray-500">{copy.emptyDesc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillOverviewScreen;

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
);

const SummaryCard: React.FC<{ title: string; value: string; iconColor: string; iconBg: string; iconPath: string }> = ({
  title,
  value,
  iconBg,
  iconColor,
  iconPath,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center">
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
        <svg className={`w-6 h-6 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path d={iconPath} />
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
