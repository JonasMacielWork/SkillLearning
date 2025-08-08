import { Card } from "@/components/ui/card";

interface Props {
  isConnected: boolean;
}

const ConnectionStatusCard = ({ isConnected }: Props) => (
  <div className="fixed bottom-6 right-6">
    <Card className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className={`status-online ${isConnected ? 'bg-accent' : 'bg-muted'}`}></div>
        <span className="text-sm font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </Card>
  </div>
);

export default ConnectionStatusCard;
