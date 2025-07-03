'use client';

import { useState } from 'react';
import { CreditCard, Check, Star } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { creditPackages } from '@/data/agents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Credits() {
  const { showModal } = useModal();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

  const paymentMethods = [
    { id: 'card', name: '신용카드', icon: '💳' },
    { id: 'bank', name: '계좌이체', icon: '🏦' },
    { id: 'kakaopay', name: '카카오페이', icon: '💬' },
    { id: 'naverpay', name: '네이버페이', icon: '🅽' },
  ];

  const handlePurchase = () => {
    if (!selectedPackage) {
      showModal({
        title: '패키지 선택 필요',
        message: '크레딧 패키지를 선택해주세요.',
        type: 'warning'
      });
      return;
    }
    
    const pkg = creditPackages.find(p => p.id === selectedPackage);
    showModal({
      title: '구매 완료',
      message: `${pkg?.name} 구매가 완료되었습니다!\n${pkg?.credits}개 크레딧이 추가되었습니다.`,
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">크레딧 충전</h1>
          <p className="text-gray-600">AI 에이전트 사용을 위한 크레딧을 충전하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credit Packages */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">크레딧 패키지 선택</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
                    selectedPackage === pkg.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        인기
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {pkg.credits.toLocaleString()}
                      <span className="text-lg text-gray-600 ml-1">크레딧</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      {pkg.price.toLocaleString()}원
                    </div>
                    
                    {(pkg.bonus && pkg.bonus > 0) && (
                      <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                        + {pkg.bonus.toLocaleString()} 보너스 크레딧
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      크레딧당 {(pkg.price / pkg.credits).toFixed(1)}원
                    </div>
                  </div>
                  
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">결제 방법</h2>
                
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.name}</span>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-blue-500 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>

                {/* Order Summary */}
                {selectedPackage && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">주문 요약</h3>
                    {(() => {
                      const pkg = creditPackages.find(p => p.id === selectedPackage);
                      if (!pkg) return null;
                      
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{pkg.name}</span>
                            <span className="font-medium">{pkg.price.toLocaleString()}원</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">기본 크레딧</span>
                            <span>{pkg.credits.toLocaleString()}개</span>
                          </div>
                                                     {(pkg.bonus && pkg.bonus > 0) && (
                             <div className="flex justify-between text-green-600">
                               <span>보너스 크레딧</span>
                               <span>+{pkg.bonus.toLocaleString()}개</span>
                             </div>
                           )}
                           <div className="border-t border-gray-200 pt-2 mt-2">
                             <div className="flex justify-between font-semibold">
                               <span>총 크레딧</span>
                               <span>{(pkg.credits + (pkg.bonus || 0)).toLocaleString()}개</span>
                             </div>
                            <div className="flex justify-between font-semibold text-lg">
                              <span>결제 금액</span>
                              <span>{pkg.price.toLocaleString()}원</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={!selectedPackage}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CreditCard className="w-5 h-5 inline mr-2" />
                  결제하기
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  결제 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 