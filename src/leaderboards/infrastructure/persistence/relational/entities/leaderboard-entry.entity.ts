import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'leaderboard_entry',
})
@Unique(['leaderboardId', 'userId'])
@Index(['leaderboardId', 'score'])
@Index(['userId', 'timestamp'])
export class LeaderboardEntryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String, length: 50 })
  leaderboardId: string;

  @Index()
  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => UserEntity, {
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  // username removed - entries tied to userId only

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
