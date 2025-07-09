import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'leaderboard_entry',
})
@Unique(['leaderboardId', 'username'])
@Index(['leaderboardId', 'score'])
@Index(['username', 'timestamp'])
export class LeaderboardEntryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String, length: 50 })
  leaderboardId: string;

  @Index()
  @Column({ type: String, length: 20 })
  username: string;

  @Column({ type: 'integer', unsigned: true })
  score: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
