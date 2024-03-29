import styled from '@emotion/styled';

export const ConfigWrapper = styled.div`
	padding-top: 24px;

	.-fields {
		margin-bottom: 16px;
	}

	.divider {
		padding-bottom: 16px;

		&::after {
			content: "";
			display: block;
			border-bottom: .5px dashed #dddddd;
		}
	}

	.control-label {
		font-size: 14px;
	}

	.items{
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		text-align: center;
		user-select: none;
	}

	.items .drag-box{
		padding: 3px 12px;
		border-radius: 999px;
		margin-bottom:10px;
		margin-right: 10px;
		font-size: 14px;
	}

	.items .drag-box[data-type=standardField]{
		border: solid 0.5px #0069c2;
		background-color: #f2f8ff;
		color: #0069c2;
	}
	.items .drag-box[data-type=formField]{
		border: solid 0.5px #70be20;
		background-color: #e9f6dc;
		color: #509609;
	}
	.items .drag-box[draggable=true]{
		cursor: grab;
	}
	/* .items .drag-box::before{
		content: attr(data-name);
	} */
	.tipLabel{
		display: flex;
		align-items: center;
		span{
			margin-left: 3px;
		}
	}
	.formula{
		margin-top: 24px;
		position: relative;
	}
	.formula .items{
		align-items: center;
		padding: 10px 14px;
		padding-bottom: 40px;
		border-radius: 4px;
		border: solid 1px #dddddd;
		min-height: 190px;
		position: relative;
		overflow: hidden;
	}

	.formula.error .items {
		border-color: #a94442;
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 4px rgba(169, 68, 66, 0.5);
		animation-name: error-shake;
		animation-duration: 250ms;
	}

	.formula.error .-msg {
		font-size: 12px;
		padding-top: 6px;
		color: #c12e2a;
	}

	.formula .btn-delete{

		width: 32px;
		height: 32px;
		padding: 7px 8px;
		line-height: 23px;
		border-radius: 50%;
		background-color: #f3f3f3;
		margin: 8px;
		font-size: 16px;
		cursor: pointer;
		line-height: 16px;
		border: solid 1px transparent;
		transition: all .1s;
		color: #7e7e7e;
		z-index: 1;
		box-shadow: 0 0 4px 0 #39c8d0;
		border: solid 1px #39c8d0;
		color: #00afb8;
		/*
		&:hover, &.light {
			box-shadow: 0 0 4px 0 #39c8d0;
			border: solid 1px #39c8d0;
			color: #00afb8;
		}
		*/
		&.active{
			opacity: 1;
			bottom: 0;
		}
		&.hover{
			transform: scale(1.2);
		}
		&::before{
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}
	}
	.formula .items .clear{
		position: absolute;
		bottom: 10px;
		right: 16px;
		font-size: 12px;
		z-index: 1;
		cursor: pointer;
		&:hover{
			text-decoration: underline;
		}
	}
`;