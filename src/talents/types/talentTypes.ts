import { SkillId } from "../../skill/types/skillTypes"

export type TalentId = 'AGIT' | 'CHASORIG' | 'CITVOL' | 'COSM' | 'EDN' | 'EDS' | 'FORT' | 'ARCMON' | 'NAVORIG' | 
'SAUV' | 'AMER' | 'COMM' | 'ENT' | 'PRETRE' | 'RUR' | 'SEN' | 'SURV' | 'VAG' | 'AGI' | 'AGIFEL' | 'MESS' | 'INSTSAUV' | 'REFECL' | 
'VIVFAUV' | 'ALC' | 'MAIFOR' | 'MAIALC' | 'AMA' | 'PREC' | 'OEILLYNX' | 'VISHORI' | 'TIRELIT' | 'TIRRAP' | 'GREFLECH' | 'OBSCSOL' | 
'STRAT' | 'OBS' | 'GEN' | 'CONQ' | 'ARTI' | 'BALL' | 'BOMBDEV' | 'COMP' | 'MAIARTI' | 'OEUVART' | 'SAB' | 'ARMU' | 'BARR' | 'MAC' | 
'SOLI' | 'ARAIHUM' | 'POIFER' | 'NAGNE' | 'PUI' | 'PUG' | 'BRUEPAI' | 'CAP' | 'CHEFEX' | 'OEILGUA' | 'VETAVIS' | 'ECOUMOI' | 'AUT' | 'SBI' | 
'SAGTRANQ' | 'SOPH' | 'MENNEC' | 'MOTIV' | 'OREIATT' | 'PARAPAI' | 'SURTENE' | 'SCRI' | 'SAG' | 'TERRENT' | 'UNENTREEUX' | 'ANALPOL' | 
'CONNENN' | 'ENNENN' | 'COUR' | 'VOLOFER' | 'HEUSUPER' | 'BEN' | 'IMPER' | 'PRU' | 'EMPANI' | 'CAV' | 'FIDCOMP' | 'VET' | 'YEUXFOR' | 'VJHEB' | 
'EJHEB' | 'OMB' | 'CAM' | 'PISOBS' | 'MAIDEG' | 'EMBPAR' | 'DAGDISS' | 'TUECACH' | 'ASS' | 'SIXS' | 'PERCVOI' | 'LIRSIGN' | 'VISAME' | 'DIV' | 
'SECINN' | 'DECSOR' | 'LANVOY' | 'ACC' | 'POLYG' | 'LANGCOR' | 'TRAD' | 'DECRY' | 'DBLLANGU' | 'SSPIT' | 'FINLAM' | 'ADA' | 'ETREI' | 'PULSMEU' | 
'SANG' | 'CPGRAC' | 'MAR' | 'NAV' | 'VIGI' | 'GAB' | 'PIEDMAR' | 'SOL' | 'LOUPMER' | 'SSAIG' | 'MEMEIDI' | 'FOU' | 'ESP' | 'ECL' | 'PERGUE' | 
'CPMAI' | 'DEFL' | 'GUEACC' | 'SIMCBT' | 'AMUPUB' | 'RIP' | 'PARSUR' | 'INTIM' | 'GREFOR' | 'CHAR' | 'SED' | 'BAR' | 'SSREM' | 'CAME' | 'ROB' | 
'INFAT' | 'TETU' | 'RESILI' | 'DURCUIR' | 'TEN' | 'ACIERTRMP' | 'MINAIS' | 'RIC' | 'OREROI' | 'REPU' | 'BAV' | 'AMIMAUL' | 'AMIPUI' | 'PANBLE' | 
'EVIDGR' | 'CVPIQ' | 'ANAT' | 'MEDIMP' | 'APOTH' | 'CHIR' | 'COMPINNEE' | 'SUPERPRO' | 'CHASSSOR' | 'FLDEM' | 'RIT' | 'SKEL' | 'EXPL' | 'PROT' | 
'SOR' | 'PAC' | 'ECHAME' | 'VIETER' | 'ENDU' | 'ENCH' | 'SORDOR' | 'MALE' | 'ETATSAUV' | 'TRAQ' | 'CHASS' | 'VIVNAT' | 'RISQ' | 'REMREC' | 'VOL' | 
'LEGURB' | 'ARGF' | 'EXP' | 'MAIVOL' | 'FAN' | 'CAMB' | 'CHAPER' | 'TROMOR' | 'DEJET' | 'PORBON'
export type Talent = {
    id: TalentId
    name: string
    description: string
    skill: SkillId | 'ORIG' | 'CAST'
    level: number
    prerequisite: string
}