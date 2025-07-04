<?php
namespace Sp\Orderattachment\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Psr\Log\LoggerInterface;

class AttachmentOrderAfterPlaceObserver implements ObserverInterface
{
    protected $attachmentCollection;
    protected $logger;

    public function __construct(
        \Sp\Orderattachment\Model\ResourceModel\Attachment\Collection $attachmentCollection,
        LoggerInterface $logger
    ) {
        $this->attachmentCollection = $attachmentCollection;
        $this->logger = $logger;
    }

    public function execute(EventObserver $observer)
    {
        $order = $observer->getEvent()->getOrder();
        if (!$order) {
            return $this;
        }

        $attachments = $this->attachmentCollection
            ->addFieldToFilter('quote_id', $order->getQuoteId())
            ->addFieldToFilter('order_id', ['is' => new \Zend_Db_Expr('null')]);

        foreach ($attachments as $attachment) {
            try {
                $attachment->setOrderId($order->getId())->save();
            } catch (\Exception $e) {
                $this->logger->error('Error saving attachment: ' . $e->getMessage());
                continue;
            }
        }

        return $this;
    }
}
