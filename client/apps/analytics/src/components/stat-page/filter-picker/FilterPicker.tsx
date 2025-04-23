import { AssignmentTurnedIn, BarChart, EditNote, Timeline } from "@mui/icons-material";
import { MenuItem, Select, SelectChangeEvent, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { StatsFilter, ViewType, StatsFilterType } from "../../../models";
import TranslatedPicker from "./translated-picker/TranslatedPicker";
import './FilterPicker.scss';
import { useTranslator } from '../../../service/TranslateService';
import { useAppSelector } from '../../../state';
import { LoadStatus } from '@gearscout/models';

interface IProps {
    viewType: ViewType;
    inspectionQuestions: string[];
    commentTopics: string[];
    statTopics: string[];
    filter: StatsFilter;
    selectFilter: (filter: StatsFilter) => void;
}

function FilterPicker(props: IProps) {
    const translate = useTranslator();

    const statsLoadStatus: LoadStatus = useAppSelector(state => state.stats.loadStatus);
    const inspectionsLoadStatus: LoadStatus = useAppSelector(state => state.inspections.loadStatus);
    const commentsLoadStatus: LoadStatus = useAppSelector(state => state.comments.loadStatus);


    const showStatsPicker = statsLoadStatus === LoadStatus.success
        && props.filter.filterType === StatsFilterType.stats;
    const showInspectionsPicker = inspectionsLoadStatus === LoadStatus.success
        && props.filter.filterType === StatsFilterType.inspection;
    const showCommentsPicker = commentsLoadStatus === LoadStatus.success
        && props.filter.filterType === StatsFilterType.comments;


    const showComentsQuery = showCommentsPicker
        && props.filter.topic !== '';


    return (
        <div className="filter-picker">
            { showComentsQuery && commentsQuery(props, translate) }

            { showStatsPicker && statsPicker(props) }
            { showInspectionsPicker && inspectionPicker(props) }
            { showCommentsPicker && commentsPicker(props) }

            <ToggleButtonGroup
                size="small"
                exclusive={ true }
                value={ props.filter.filterType }
                onChange={ (_, next: StatsFilterType) => {
                    if (next == undefined || next === props.filter.filterType) {
                        return;
                    }

                    props.selectFilter({
                        filterType: next,
                        topic: '',
                        query: ''
                    });
                }}
                aria-label="Data filter type"
                sx={{ display: 'block', marginBottom: '8px' }}
            >
                <ToggleButton
                    value={ StatsFilterType.none }
                    aria-label="No data filtering"
                >
                    <BarChart/>
                </ToggleButton>

                { inspectionsLoadStatus === LoadStatus.success && (
                    <Tooltip title={ translate('INSPECTIONS') }>
                        <ToggleButton
                            value={ StatsFilterType.inspection }
                            aria-label="Filter by inspection"
                        >
                            <AssignmentTurnedIn/>
                        </ToggleButton>
                    </Tooltip>
                )}

                { statsLoadStatus === LoadStatus.success && (
                    <Tooltip title={ translate('STATS') }>
                        <ToggleButton
                            value={ StatsFilterType.stats }
                            aria-label="Filter by stats"
                        >
                            <Timeline/>
                        </ToggleButton>
                    </Tooltip>
                )}

                { commentsLoadStatus === LoadStatus.success && (
                    <Tooltip title={ translate('NOTES') }>
                        <ToggleButton
                            value={ StatsFilterType.comments }
                            aria-label="Filter by notes"
                        >
                            <EditNote/>
                        </ToggleButton>
                    </Tooltip>
                )}
            </ToggleButtonGroup>

            
        </div>
    );
}

function statsPicker(props: IProps) {
    return (
        <Select
            size="small"
            value={ props.filter.topic }
            onChange={ (event: SelectChangeEvent) => {
                props.selectFilter({
                    ...props.filter,
                    topic: event.target.value
                })
            }}
            aria-label="Filter type"
            sx={{ display: 'block', marginBottom: '8px' }}
        >
            {
                props.statTopics.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                ))
            }
        </Select>
    )
}

function inspectionPicker(props: IProps) {
    return (
        <TranslatedPicker
            options={ props.inspectionQuestions }
            selected={ props.filter.topic }
            setSelected={ (next: string) => {
                props.selectFilter({
                    ...props.filter,
                    topic: next
                });
            }}
        />
    )
}

function commentsPicker(props: IProps) {
    return (
        <TranslatedPicker
            options={ props.commentTopics }
            selected={ props.filter.topic }
            setSelected={ (next: string) => {
                props.selectFilter({
                    ...props.filter,
                    topic: next
                });
            }}
        />
    )
}

function commentsQuery(props: IProps, translate: (key: string) => string) {
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder={ translate('SEARCH') }
            onChange={ (event) => {
                console.log(event.target.value);
                props.selectFilter({
                    ...props.filter,
                    query: event.target.value
                });
            }}
        />
    )
}

export default FilterPicker;
