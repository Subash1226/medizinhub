<?php
namespace MedizinhubCore\Shipping\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\DataObject;
use Magento\Shipping\Model\Carrier\AbstractCarrier;
use Magento\Shipping\Model\Carrier\CarrierInterface;
use Magento\Shipping\Model\Rate\ResultFactory;
use Magento\Quote\Model\Quote\Address\RateResult\MethodFactory;
use Magento\Quote\Model\Quote\Address\RateResult\ErrorFactory;
use Psr\Log\LoggerInterface;

class Carrier extends AbstractCarrier implements CarrierInterface
{
    protected $_code = 'medizinhubshipping';
    protected $_rateResultFactory;
    protected $_rateMethodFactory;

    public function __construct(
        ScopeConfigInterface $scopeConfig,
        ErrorFactory $rateErrorFactory,
        LoggerInterface $logger,
        ResultFactory $rateResultFactory,
        MethodFactory $rateMethodFactory,
        array $data = []
    ) {
        $this->_rateResultFactory = $rateResultFactory;
        $this->_rateMethodFactory = $rateMethodFactory;
        parent::__construct($scopeConfig, $rateErrorFactory, $logger, $data);
    }

    private function calculateShippingFee($state, $subtotal, $postcode)
    {
        // Special pincode rate
        $specialPincodes = explode(',', $this->getConfigData('special_pincode'));
        if (in_array($postcode, $specialPincodes)) {
            $threshold = (float)$this->getConfigData('special_pincode_threshold');
            if ($subtotal >= $threshold) {
                return (float)$this->getConfigData('special_pincode_above_rate');
            } else {
                return (float)$this->getConfigData('special_pincode_rate');
            }
        }

        // Tamil Nadu specific rates
        if ($state === 'TN') {
            $tier1Max = (float)$this->getConfigData('tn_tier1_max');
            $tier2Max = (float)$this->getConfigData('tn_tier2_max');
            $tier3Max = (float)$this->getConfigData('tn_tier3_max');

            if ($subtotal > $tier3Max) {
                return (float)$this->getConfigData('tn_default_rate');
            } elseif ($subtotal > $tier2Max) {
                return (float)$this->getConfigData('tn_rate_tier3');
            } elseif ($subtotal > $tier1Max) {
                return (float)$this->getConfigData('tn_rate_tier2');
            } else {
                return (float)$this->getConfigData('tn_rate_tier1');
            }
        }

        // Border states
        $borderStates = explode(',', $this->getConfigData('border_states'));
        if (in_array($state, $borderStates)) {
            return (float)$this->getConfigData('border_state_rate');
        }

        // Other specified states
        $otherStates = explode(',', $this->getConfigData('other_states'));
        if (in_array($state, $otherStates)) {
            return (float)$this->getConfigData('other_states_rate');
        }

        // Default rate for any remaining states
        return (float)$this->getConfigData('default_rate');
    }

    public function collectRates(DataObject $request)
    {
        if (!$this->isActive()) {
            return false;
        }

        $result = $this->_rateResultFactory->create();
        $method = $this->_rateMethodFactory->create();

        $method->setCarrier($this->_code);
        $method->setCarrierTitle($this->getConfigData('title'));
        $method->setMethod($this->_code);
        $method->setMethodTitle($this->getConfigData('name'));

        $subtotal = $request->getBaseSubtotalInclTax() ?: $request->getPackageValue();
        $state = $request->getDestRegionCode();
        $postcode = $request->getDestPostcode();

        $shippingPrice = $this->calculateShippingFee($state, $subtotal, $postcode);

        $method->setPrice($shippingPrice);
        $method->setCost($shippingPrice);
        $result->append($method);

        return $result;
    }

    public function getAllowedMethods()
    {
        return [$this->_code => $this->getConfigData('name')];
    }
}