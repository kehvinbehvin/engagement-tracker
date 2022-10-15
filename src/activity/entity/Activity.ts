import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany, OneToOne, JoinTable } from "typeorm"
import { Newcomer } from "../../newcomer/entity/Newcomer"
import { User } from "../../user/entity/User"

export enum ActivityType {
    CG = "cg",
    SERVICE = "service",
    EVENT = "event",
    CHAT = "chat",
    PRAYER = "prayer",
    BLANK = "blank"
}

@Entity({name: "Activity"})
export class Activity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: "timestamp" })
    activityDate: string // 'YYYY-MM-DD hh:mm:ss'
    
    @Column("enum", { enum: ActivityType, default: ActivityType.BLANK })
    type: string

    @OneToOne(() => Newcomer, (newcomer) => newcomer.activity)
    newcomer: Newcomer

    @ManyToMany(() => User, (admins) => admins.activity)
    @JoinTable()
    admins: User[]
}

